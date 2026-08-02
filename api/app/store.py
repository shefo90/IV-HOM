"""
Reading and writing the content repo.

Shared by the routes and the CLI so seeding and saving go through exactly the
same path — including the lock, the commit, and the dist rebuild.
"""

from __future__ import annotations

import json
from typing import Any

from .config import settings
from .gitrepo import ContentRepo

repo = ContentRepo(settings.content_dir, settings.lock_file, settings.backup_remote)


def page_path(slug: str):
    return settings.pages_dir / f"{slug}.json"


def rel_page_path(slug: str) -> str:
    return f"pages/{slug}.json"


def read_page(slug: str) -> Any | None:
    path = page_path(slug)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _dump(data: Any) -> str:
    # ensure_ascii=False keeps the em dashes and non-breaking hyphens in the
    # copy readable in a diff, which is the point of storing files at all.
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def rebuild_dist() -> None:
    """
    Merge every page into the single file nginx serves.

    This is why the public read path never touches Python: the site fetches a
    static file, so it stays fast and keeps working with this container down.
    """
    merged = {}
    for path in sorted(settings.pages_dir.glob("*.json")):
        merged[path.stem] = json.loads(path.read_text(encoding="utf-8"))

    settings.dist_file.parent.mkdir(parents=True, exist_ok=True)
    settings.dist_file.write_text(
        json.dumps(merged, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def write_page(slug: str, data: Any, message: str, author: str | None) -> str | None:
    """
    Write, commit, and regenerate the merged payload as one locked operation.
    Returns the new commit sha, or None if the content was unchanged.
    """
    with repo.lock:
        settings.pages_dir.mkdir(parents=True, exist_ok=True)
        page_path(slug).write_text(_dump(data), encoding="utf-8")
        sha = repo.commit_paths([rel_page_path(slug)], message, author)
        rebuild_dist()
    return sha
