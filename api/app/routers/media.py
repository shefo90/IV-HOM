"""
The media library.

The admin resizes and converts to WebP in the browser before uploading, which
keeps a 12MB phone photo off the wire. The server does not trust that: it
re-decodes every upload through Pillow, caps the dimensions again, and writes
only what Pillow produced. A file that is not a real image never lands.

Filenames get a short content hash and a replacement always writes a new name
rather than overwriting. That is what makes nginx's one-year cache header on
/media safe, and it avoids the "I uploaded the new photo but the old one still
shows" support call.
"""

from __future__ import annotations

import hashlib
import io
import re
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

from ..auth import User, require_role
from ..config import settings

router = APIRouter(prefix="/api/admin/media", tags=["media"])

Editor = Depends(require_role("editor"))

# Pillow can decode far more than this; the site only ever needs these.
ENCODERS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}
SAFE_NAME = re.compile(r"^[A-Za-z0-9._-]+$")


def _slugify(stem: str) -> str:
    stem = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()
    return (stem or "image")[:60]


def _listing() -> list[dict]:
    settings.media_dir.mkdir(parents=True, exist_ok=True)
    files = [p for p in settings.media_dir.iterdir() if p.is_file()]
    files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return [
        {"name": p.name, "url": f"/media/{p.name}", "bytes": p.stat().st_size}
        for p in files
    ]


@router.get("")
def list_media(user: User = Editor) -> list[dict]:
    return _listing()


@router.post("")
def upload_media(file: UploadFile = File(...), user: User = Editor) -> dict:
    raw = file.file.read(settings.max_upload_bytes + 1)
    if len(raw) > settings.max_upload_bytes:
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            f"Images must be under {settings.max_upload_bytes // (1024 * 1024)} MB",
        )

    try:
        image = Image.open(io.BytesIO(raw))
        image.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "That file is not a readable image"
        )

    fmt = (image.format or "").upper()
    if fmt not in ENCODERS:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Use a JPG, PNG or WebP image (got {fmt or 'unknown'})",
        )

    # Second cap, in case the upload bypassed the admin's browser-side resize.
    edge = settings.max_image_edge
    if max(image.size) > edge:
        image.thumbnail((edge, edge), Image.LANCZOS)

    buffer = io.BytesIO()
    if fmt == "JPEG":
        image.convert("RGB").save(buffer, "JPEG", quality=82, optimize=True)
    elif fmt == "PNG":
        image.save(buffer, "PNG", optimize=True)
    else:
        image.save(buffer, "WEBP", quality=82, method=4)
    encoded = buffer.getvalue()

    stem = _slugify(Path(file.filename or "image").stem)
    digest = hashlib.sha256(encoded).hexdigest()[:6]
    name = f"{stem}.{digest}{ENCODERS[fmt]}"

    settings.media_dir.mkdir(parents=True, exist_ok=True)
    (settings.media_dir / name).write_bytes(encoded)

    return {"name": name, "url": f"/media/{name}", "bytes": len(encoded)}


@router.delete("/{name}")
def delete_media(name: str, user: User = Depends(require_role("admin"))) -> dict:
    # The name comes from the URL, so refuse anything that is not a plain
    # filename before it reaches the filesystem.
    if not SAFE_NAME.match(name) or name in (".", ".."):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid filename")

    target = (settings.media_dir / name).resolve()
    if target.parent != settings.media_dir.resolve():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid filename")
    if not target.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such image")

    target.unlink()
    return {"deleted": name}
