"""
Form submissions: one public write, the rest admin-only.

`POST /api/submissions` is the only unauthenticated write on the system and is
treated accordingly — see antispam.py for the layers in front of it.
"""

from __future__ import annotations

import csv
import io
import json
from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from ..antispam import client_ip, looks_automated, over_rate_limit
from ..auth import User, require_role
from ..config import settings
from ..db import connect
from ..models import Submission, StatusUpdate, payload_of

router = APIRouter(tags=["submissions"])

Editor = Depends(require_role("editor"))


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _row_to_dict(row, *, with_payload: bool) -> dict:
    out = {
        "id": row["id"],
        "kind": row["kind"],
        "name": row["name"],
        "email": row["email"],
        "phone": row["phone"] or "",
        "status": row["status"],
        "createdAt": row["created_at"],
        "deletedAt": row["deleted_at"],
    }
    if with_payload:
        out["payload"] = json.loads(row["payload"])
        out["ip"] = row["ip"]
        out["userAgent"] = row["user_agent"]
    return out


# ------------------------------------------------------------------- public


@router.post("/api/submissions", status_code=status.HTTP_202_ACCEPTED)
def create_submission(body: Submission, request: Request) -> dict:
    ip = client_ip(request)

    # Bots get the same 202 a person gets. Telling them they were caught just
    # lets them iterate until they are not.
    if looks_automated(body.website, body.elapsed_ms):
        return {"received": True}

    if over_rate_limit(ip):
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Too many messages from this address. Please try again later.",
        )

    with connect() as conn:
        conn.execute(
            """
            INSERT INTO submissions
              (kind, name, email, phone, payload, status, ip, user_agent, created_at)
            VALUES (?, ?, ?, ?, ?, 'unread', ?, ?, ?)
            """,
            (
                body.kind,
                body.name,
                body.email,
                body.phone,
                json.dumps(payload_of(body), ensure_ascii=False),
                ip,
                request.headers.get("user-agent", "")[:400],
                _now(),
            ),
        )

    return {"received": True}


# -------------------------------------------------------------------- admin


@router.get("/api/admin/submissions")
def list_submissions(
    kind: str | None = None,
    status_filter: str | None = None,
    view: Literal["inbox", "trash"] = "inbox",
    q: str | None = None,
    limit: int = 100,
    user: User = Editor,
) -> dict:
    where = ["deleted_at IS NULL"] if view == "inbox" else ["deleted_at IS NOT NULL"]
    params: list = []

    if kind:
        where.append("kind = ?")
        params.append(kind)
    if status_filter:
        where.append("status = ?")
        params.append(status_filter)
    if q:
        where.append("(name LIKE ? OR email LIKE ?)")
        params += [f"%{q}%", f"%{q}%"]

    sql = (
        f"SELECT * FROM submissions WHERE {' AND '.join(where)} "
        "ORDER BY created_at DESC LIMIT ?"
    )
    params.append(min(limit, 500))

    with connect() as conn:
        rows = conn.execute(sql, params).fetchall()
        unread = conn.execute(
            "SELECT COUNT(*) AS n FROM submissions "
            "WHERE deleted_at IS NULL AND status = 'unread'"
        ).fetchone()["n"]

    return {
        "items": [_row_to_dict(r, with_payload=False) for r in rows],
        "unread": unread,
    }


@router.get("/api/admin/submissions/export.csv")
def export_csv(user: User = Editor) -> Response:
    with connect() as conn:
        rows = conn.execute(
            "SELECT * FROM submissions WHERE deleted_at IS NULL ORDER BY created_at DESC"
        ).fetchall()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["id", "kind", "name", "email", "phone", "status", "created", "details"])
    for row in rows:
        payload = json.loads(row["payload"])
        writer.writerow(
            [
                row["id"], row["kind"], row["name"], row["email"], row["phone"] or "",
                row["status"], row["created_at"],
                "; ".join(f"{k}: {v}" for k, v in payload.items() if v),
            ]
        )

    return Response(
        buffer.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="submissions.csv"'},
    )


@router.get("/api/admin/submissions/{submission_id}")
def get_submission(submission_id: int, user: User = Editor) -> dict:
    with connect() as conn:
        row = conn.execute(
            "SELECT * FROM submissions WHERE id = ?", (submission_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No such message")
        # Opening a message marks it read; that is what the unread badge counts.
        if row["status"] == "unread":
            conn.execute(
                "UPDATE submissions SET status = 'read' WHERE id = ?", (submission_id,)
            )
            row = conn.execute(
                "SELECT * FROM submissions WHERE id = ?", (submission_id,)
            ).fetchone()

    return _row_to_dict(row, with_payload=True)


@router.patch("/api/admin/submissions/{submission_id}")
def set_status(submission_id: int, body: StatusUpdate, user: User = Editor) -> dict:
    with connect() as conn:
        cursor = conn.execute(
            "UPDATE submissions SET status = ? WHERE id = ?", (body.status, submission_id)
        )
        if cursor.rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No such message")
    return {"id": submission_id, "status": body.status}


@router.delete("/api/admin/submissions/{submission_id}")
def soft_delete(submission_id: int, user: User = Editor) -> dict:
    """Moves to Trash. A mis-click must not lose a real enquiry."""
    with connect() as conn:
        cursor = conn.execute(
            "UPDATE submissions SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
            (_now(), submission_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No such message")
    return {"id": submission_id, "deleted": True}


@router.post("/api/admin/submissions/{submission_id}/restore")
def restore(submission_id: int, user: User = Editor) -> dict:
    with connect() as conn:
        cursor = conn.execute(
            "UPDATE submissions SET deleted_at = NULL WHERE id = ?", (submission_id,)
        )
        if cursor.rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No such message")
    return {"id": submission_id, "restored": True}


@router.post("/api/admin/submissions/purge")
def purge(user: User = Depends(require_role("admin"))) -> dict:
    """Permanently removes Trash older than the retention window."""
    cutoff = (
        datetime.now(timezone.utc) - timedelta(days=settings.trash_retention_days)
    ).isoformat(timespec="seconds")

    with connect() as conn:
        cursor = conn.execute(
            "DELETE FROM submissions WHERE deleted_at IS NOT NULL AND deleted_at < ?",
            (cutoff,),
        )
        removed = cursor.rowcount

    return {"purged": removed, "olderThan": cutoff}
