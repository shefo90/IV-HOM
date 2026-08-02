"""
Reading and editing the eight content documents.

Handlers are plain `def`, not `async def`, so FastAPI runs them in its
threadpool — the blocking git calls underneath never stall the event loop.
"""

from __future__ import annotations

import json
from typing import Annotated, Any

from fastapi import APIRouter, BackgroundTasks, Body, Depends, HTTPException, status

from ..auth import User, require_role
from ..models import RestoreRequest
from ..store import read_page, rel_page_path, repo, write_page
from ..validate import ValidationError, find_document, load_schema, validate_document

router = APIRouter(prefix="/api", tags=["content"])

Editor = Depends(require_role("editor"))


def _known(slug: str) -> None:
    if find_document(slug) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Unknown page '{slug}'")


@router.get("/schema")
def get_schema(user: User = Editor) -> dict:
    """The admin renders its forms from this, so the UI can never drift."""
    return load_schema()


@router.get("/admin/content/{slug}")
def get_page(slug: str, user: User = Editor) -> Any:
    _known(slug)
    data = read_page(slug)
    if data is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"'{slug}' has not been seeded")
    return data


@router.put("/admin/content/{slug}")
def put_page(
    slug: str,
    # Body() is required: a bare `dict`/`Any` is read as a query parameter,
    # and FastAPI rejects the request before validate_document ever runs.
    payload: Annotated[dict, Body()],
    background: BackgroundTasks,
    user: User = Editor,
) -> dict:
    _known(slug)

    try:
        validate_document(slug, payload)
    except ValidationError as exc:
        # Every problem at once, so the admin can highlight all the bad fields
        # rather than making the client resubmit to find the next one.
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            {"message": "Content is not valid", "errors": exc.errors},
        )

    sha = write_page(slug, payload, f"Update {slug}", user.git_author)

    # Best effort and out of band: a failed push must never fail the save.
    # The nightly cron is the actual backup guarantee.
    background.add_task(repo.push)

    return {"slug": slug, "sha": sha, "changed": sha is not None}


@router.get("/admin/content/{slug}/history")
def get_history(slug: str, limit: int = 30, user: User = Editor) -> list[dict]:
    _known(slug)
    return [
        {
            "sha": c.sha,
            "author": c.author,
            "email": c.email,
            "when": c.when,
            "message": c.message,
        }
        for c in repo.log(rel_page_path(slug), min(limit, 100))
    ]


@router.get("/admin/content/{slug}/at/{sha}")
def get_page_at(slug: str, sha: str, user: User = Editor) -> Any:
    """Used by the history panel to preview a version before restoring it."""
    _known(slug)
    try:
        return json.loads(repo.show(sha, rel_page_path(slug)))
    except Exception:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "That version is not available")


@router.post("/admin/content/{slug}/restore")
def restore_page(
    slug: str,
    body: RestoreRequest,
    background: BackgroundTasks,
    user: User = Editor,
) -> dict:
    _known(slug)

    try:
        previous = json.loads(repo.show(body.sha, rel_page_path(slug)))
    except Exception:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "That version is not available")

    # Restoring is itself an edit, never a hard reset: history only ever grows,
    # so a restore can be undone the same way anything else can.
    sha = write_page(
        slug, previous, f"Restore {slug} to {body.sha[:8]}", user.git_author
    )
    background.add_task(repo.push)

    return {"slug": slug, "sha": sha, "restoredFrom": body.sha}
