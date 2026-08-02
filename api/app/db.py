"""
SQLite for form submissions.

Content lives in git; submissions do not. They are an append-heavy log of
personal data with mutable read/handled status — every spam bot would become a
commit, and the content repo is pushed off-site to a backup remote. Different
workload, different store, deliberately separate volume.

Plain sqlite3 from the standard library: two tables do not justify an ORM, and
it keeps the dependency list short.
"""

from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from typing import Iterator

from .config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  kind        TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  payload     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'unread',
  deleted_at  TEXT,
  ip          TEXT,
  user_agent  TEXT,
  created_at  TEXT NOT NULL
);

-- The inbox list is always "not deleted, newest first".
CREATE INDEX IF NOT EXISTS idx_submissions_inbox
  ON submissions (deleted_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);

CREATE TABLE IF NOT EXISTS rate_limit (
  ip           TEXT NOT NULL,
  window_start TEXT NOT NULL,
  count        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, window_start)
);
"""


def init_db() -> None:
    settings.db_file.parent.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(SCHEMA)


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    """
    One connection per call. Route handlers are sync, so FastAPI runs them in
    its threadpool and a shared connection would need locking anyway.
    """
    conn = sqlite3.connect(settings.db_file, timeout=10)
    conn.row_factory = sqlite3.Row
    # WAL lets the admin read while a visitor is submitting.
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
