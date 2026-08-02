"""
Validates a submitted document against site_schema.json.

The same schema drives the admin's form renderer, so the UI and the API agree
by construction. This runs regardless: the form is a convenience, the API is
the boundary, and every check here must hold for a raw curl request too.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from typing import Any

from .config import settings

# Generous but finite. The point is to stop a runaway paste or a hostile
# payload, not to police prose.
MAX_LEN = {"string": 300, "richtext": 500, "text": 5000, "image": 300}

# Media lives in one flat directory; anything with a path separator or a
# traversal segment is rejected outright.
MEDIA_RE = re.compile(r"^/media/[A-Za-z0-9._-]+$")


class ValidationError(ValueError):
    def __init__(self, errors: list[str]):
        self.errors = errors
        super().__init__("; ".join(errors))


@lru_cache(maxsize=1)
def load_schema() -> dict:
    return json.loads(settings.schema_file.read_text(encoding="utf-8"))


def document_slugs() -> list[str]:
    return [doc["slug"] for doc in load_schema()["documents"]]


def find_document(slug: str) -> dict | None:
    return next((d for d in load_schema()["documents"] if d["slug"] == slug), None)


def _check_scalar(value: Any, field: dict, path: str, errors: list[str]) -> None:
    kind = field["type"]

    if not isinstance(value, str):
        errors.append(f"{path}: expected text, got {type(value).__name__}")
        return

    if field.get("required") and not value.strip():
        errors.append(f"{path}: required")

    limit = MAX_LEN.get(kind, 300)
    if len(value) > limit:
        errors.append(f"{path}: longer than {limit} characters")

    if kind == "image" and value and not MEDIA_RE.match(value):
        errors.append(f"{path}: must be an uploaded media path like /media/photo.jpg")


def _check_field(value: Any, field: dict, path: str, errors: list[str]) -> None:
    kind = field["type"]

    if kind == "group":
        _check_group(value, field["fields"], path, errors)
        return

    if kind == "list":
        if not isinstance(value, list):
            errors.append(f"{path}: expected a list")
            return

        lo, hi = field.get("min"), field.get("max")
        if lo is not None and len(value) < lo:
            errors.append(f"{path}: needs at least {lo} item(s), got {len(value)}")
        if hi is not None and len(value) > hi:
            errors.append(f"{path}: allows at most {hi} item(s), got {len(value)}")

        item = field["item"]
        for i, entry in enumerate(value):
            if item["type"] == "group":
                _check_group(entry, item["fields"], f"{path}[{i}]", errors)
            else:
                _check_scalar(entry, {**item, "required": True}, f"{path}[{i}]", errors)
        return

    _check_scalar(value, field, path, errors)


def _check_group(value: Any, fields: list[dict], path: str, errors: list[str]) -> None:
    if not isinstance(value, dict):
        errors.append(f"{path}: expected an object")
        return

    known = {f["key"] for f in fields}
    for extra in sorted(set(value) - known):
        errors.append(f"{path}.{extra}: unknown field")

    for field in fields:
        key = field["key"]
        child = f"{path}.{key}" if path else key

        if key not in value:
            # A field may be omitted only when the schema says so explicitly.
            # That includes groups: the lifetime warranty card has no `count`,
            # so the generator marks it optional and it must be allowed to
            # stay absent rather than being sent as an empty object.
            if field.get("required") is not False:
                errors.append(f"{child}: missing")
            continue

        _check_field(value[key], field, child, errors)


def validate_document(slug: str, payload: Any) -> None:
    """Raises ValidationError listing every problem, not just the first."""
    document = find_document(slug)
    if document is None:
        raise ValidationError([f"unknown document '{slug}'"])

    errors: list[str] = []
    _check_group(payload, document["fields"], "", errors)
    if errors:
        raise ValidationError(errors)
