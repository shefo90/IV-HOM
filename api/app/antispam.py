"""
Guards for the one unauthenticated write endpoint.

Layered on purpose, cheapest first, and none of them is a captcha: this is a
low-traffic business enquiry form, and a puzzle in front of a real lead costs
more than the spam does. If these prove insufficient, Cloudflare Turnstile is
the escalation — not built speculatively, since it would be the only external
dependency in the system.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import Request

from .config import settings
from .db import connect

# Bots submit instantly. A person cannot read the form and type a name faster
# than this. Trivially forged, which is why it is not the only defence.
MIN_ELAPSED_MS = 2000


def client_ip(request: Request) -> str:
    """
    nginx sets X-Forwarded-For; take the first hop. Falls back to the socket
    address so this still works when the API is hit directly.
    """
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()[:64]
    return (request.client.host if request.client else "unknown")[:64]


def looks_automated(website: str, elapsed_ms: int) -> bool:
    """
    True when the request should be silently accepted and dropped.

    Silently, because a bot that learns which of its submissions were rejected
    can iterate; one that always sees 200 has nothing to tune against.
    """
    if website.strip():
        return True
    # elapsed_ms == 0 means the client did not send it at all — treat that as
    # unknown rather than instant, so a non-JS or older client is not punished.
    return 0 < elapsed_ms < MIN_ELAPSED_MS


def over_rate_limit(ip: str) -> bool:
    """
    Per-IP hourly ceiling, a second line behind nginx's `limit_req`. nginx
    smooths bursts; this caps the sustained total.
    """
    window = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H")
    limit = settings.submissions_per_ip_per_hour

    with connect() as conn:
        row = conn.execute(
            "SELECT count FROM rate_limit WHERE ip = ? AND window_start = ?",
            (ip, window),
        ).fetchone()
        if row and row["count"] >= limit:
            return True

        conn.execute(
            """
            INSERT INTO rate_limit (ip, window_start, count) VALUES (?, ?, 1)
            ON CONFLICT(ip, window_start) DO UPDATE SET count = count + 1
            """,
            (ip, window),
        )
        # Old windows are dead weight; drop them opportunistically.
        conn.execute("DELETE FROM rate_limit WHERE window_start < ?", (window,))
    return False
