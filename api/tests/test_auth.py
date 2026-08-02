"""Sessions and role enforcement."""

from __future__ import annotations


def test_unauthenticated_requests_get_401_not_data(client):
    for path in ("/api/schema", "/api/admin/content/about", "/api/admin/submissions"):
        response = client.get(path)
        assert response.status_code == 401, path
        assert "eyebrow" not in response.text


def test_login_sets_an_httponly_strict_cookie(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "editor@test.com", "password": "editor-password"},
    )
    assert response.status_code == 200
    assert response.json()["role"] == "editor"

    raw = response.headers["set-cookie"].lower()
    assert "httponly" in raw
    assert "samesite=strict" in raw


def test_wrong_password_is_rejected_without_revealing_the_account(client):
    missing = client.post(
        "/api/auth/login", json={"email": "nobody@test.com", "password": "whatever"}
    )
    wrong = client.post(
        "/api/auth/login", json={"email": "editor@test.com", "password": "whatever"}
    )
    assert missing.status_code == wrong.status_code == 401
    assert missing.json()["detail"] == wrong.json()["detail"]


def test_logout_clears_the_session(editor):
    assert editor.get("/api/auth/me").status_code == 200
    editor.post("/api/auth/logout")
    assert editor.get("/api/auth/me").status_code == 401


def test_editor_cannot_reach_an_admin_only_route(editor):
    # 403 (recognised but not allowed), not 401 and not a silent success.
    assert editor.delete("/api/admin/media/luxury-kitchen.jpg").status_code == 403


def test_admin_inherits_editor_routes(admin):
    assert admin.get("/api/admin/content/about").status_code == 200
