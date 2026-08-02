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
from ..gitrepo import GitError
from ..models import RestoreRequest
from ..store import read_page, rel_page_path, repo, write_page
from ..validate import ValidationError, find_document, load_schema, validate_document

router = APIRouter(prefix="/api", tags=["content"])

Editor = Depends(require_role("editor"))
# Erasing history is the one irreversible action in the CMS, so it is the one
# thing an editor cannot do.
Admin = Depends(require_role("admin"))

# Far past the panel's own limit: the oldest-entry guard is only correct if the
# whole log is in view.
FULL_LOG = 1000


def _known(slug: str) -> None:
    if find_document(slug) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Unknown page '{slug}'")


def _page_shas(slug: str) -> list[str]:
    return [c.sha for c in repo.log(rel_page_path(slug), FULL_LOG)]


def _erase(slug: str, shas: list[str]) -> dict:
    if not shas:
        return {"slug": slug, "erased": [], "head": repo.head(), "backupUpdated": True}

    # Captured before the rewrite: it is where the backup should still be, and
    # the forced push leases against it rather than fetching to find out.
    backup_head = repo.head()

    try:
        head = repo.drop_commits(set(shas))
    except GitError as exc:
        # drop_commits only moves the branch as its last act, so the repo is
        # untouched here and the client is safe to retry.
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR, f"Could not erase history: {exc}"
        )

    # Synchronous, unlike the push after a save: the backup still holding a
    # version the admin just erased is exactly what they need to hear about,
    # and a background task could never tell them.
    backup_updated = repo.push(force_from=backup_head)

    return {"slug": slug, "erased": shas, "head": head, "backupUpdated": backup_updated}


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


@router.delete("/admin/content/{slug}/history/{sha}")
def erase_version(slug: str, sha: str, user: User = Admin) -> dict:
    """
    Erase one version for good. There is no undo, so every guard lives here
    rather than in the panel that hides the buttons.
    """
    _known(slug)
    shas = _page_shas(slug)

    if sha not in shas:
        # Also what stops this route reaching into another page's history.
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "That version is not in this page's history"
        )
    if sha == shas[0] or sha == repo.head():
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "The current version cannot be erased"
        )
    if sha == shas[-1]:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "The original version cannot be erased"
        )

    return _erase(slug, [sha])


@router.post("/admin/content/{slug}/history/purge")
def purge_history(slug: str, user: User = Admin) -> dict:
    """Erase every version of this page except the current and the original."""
    _known(slug)
    shas = _page_shas(slug)

    # Derived here rather than sent by the client: it cannot then be talked into
    # dropping the current or the original, and it cannot miss the entries that
    # fall past the panel's fetch limit.
    return _erase(slug, [sha for sha in shas[1:-1] if sha != repo.head()])


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
