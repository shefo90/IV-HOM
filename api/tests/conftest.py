"""
Test fixtures.

The environment has to be set before app.config is imported, because Settings
is a module-level singleton — hence the os.environ writes at import time rather
than in a fixture.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import pytest

_TMP = Path(tempfile.mkdtemp(prefix="iv-api-tests-"))

os.environ["IV_CONTENT_DIR"] = str(_TMP / "content")
os.environ["IV_APP_DATA_DIR"] = str(_TMP / "app")
os.environ["IV_AUTH_DIR"] = str(_TMP / "auth")
os.environ["IV_JWT_SECRET"] = "test-secret"
os.environ["IV_COOKIE_SECURE"] = "false"
os.environ["IV_BACKUP_REMOTE"] = ""

from fastapi.testclient import TestClient  # noqa: E402

from app import auth as auth_module  # noqa: E402
from app.config import settings  # noqa: E402
from app.db import connect, init_db  # noqa: E402
from app.main import app  # noqa: E402
from app.store import repo, write_page  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[2]


def pytest_sessionfinish(session, exitstatus):
    shutil.rmtree(_TMP, ignore_errors=True)


@pytest.fixture(scope="session", autouse=True)
def seeded():
    """A repo with real content, one editor and one admin."""
    # Normally the app lifespan does this, but the per-test fixtures below
    # touch the database before any TestClient has started.
    init_db()
    repo.ensure_initialised()
    # Identity is normally inherited from the host; CI containers have none.
    subprocess.run(["git", "config", "user.email", "t@example.com"], cwd=repo.root)
    subprocess.run(["git", "config", "user.name", "Test"], cwd=repo.root)

    content = (REPO_ROOT / "src/content/fallback.json").read_text(encoding="utf-8")
    import json

    for slug, data in json.loads(content).items():
        write_page(slug, data, f"Seed {slug}", None)

    settings.media_dir.mkdir(parents=True, exist_ok=True)
    (settings.media_dir / "luxury-kitchen.jpg").write_bytes(b"not-a-real-image")

    auth_module.create_user("editor@test.com", "editor-password", "Ed Editor", "editor")
    auth_module.create_user("admin@test.com", "admin-password", "Ada Admin", "admin")
    yield


@pytest.fixture(autouse=True)
def reset_rate_limit():
    """
    Every test shares one client IP, so without this the rate-limit test
    exhausts the hourly budget and starves every submission test after it.
    """
    with connect() as conn:
        conn.execute("DELETE FROM rate_limit")
    yield


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def editor(client):
    client.post(
        "/api/auth/login",
        json={"email": "editor@test.com", "password": "editor-password"},
    )
    return client


@pytest.fixture
def admin(client):
    client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "admin-password"},
    )
    return client
