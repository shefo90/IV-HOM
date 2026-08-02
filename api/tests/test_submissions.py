"""
The public write path and the inbox.

POST /api/submissions is the only unauthenticated write on the system, so its
guards are tested as carefully as the auth ones.
"""

from __future__ import annotations

CONTACT = {
    "kind": "contact",
    "name": "Nadia Farouk",
    "email": "nadia@example.com",
    "phone": "+20 100 0000000",
    "company": "Zed Developments",
    "interest": "Kitchens",
    "message": "340 units, phased over six months.",
    "elapsed_ms": 9000,
}
PROPOSAL = {
    "kind": "proposal",
    "name": "Omar Reda",
    "email": "omar@example.com",
    "phone": "+20 111 1111111",
    "project_type": "Vanities",
    "size": "45",
    "timeframe": "3-6 months",
    "details": "Two floors.",
    "elapsed_ms": 9000,
}
TOUR = {
    "kind": "tour",
    "name": "Layla Hassan",
    "email": "layla@example.com",
    "phone": "+20 122 2222222",
    "project_type": "Kitchens",
    "tour_date": "2026-09-01",
    "tour_time": "11:30",
    "elapsed_ms": 9000,
}


def _submit(client, body):
    return client.post("/api/submissions", json=body)


def test_all_three_form_kinds_reach_the_inbox(client, editor):
    for body in (CONTACT, PROPOSAL, TOUR):
        assert _submit(client, body).status_code == 202

    items = editor.get("/api/admin/submissions").json()["items"]
    kinds = {i["kind"] for i in items}
    assert {"contact", "proposal", "tour"} <= kinds


def test_kind_specific_fields_are_kept_in_the_payload(client, editor):
    _submit(client, TOUR)
    listing = editor.get("/api/admin/submissions?kind=tour").json()["items"]
    detail = editor.get(f"/api/admin/submissions/{listing[0]['id']}").json()

    assert detail["payload"]["tour_date"] == "2026-09-01"
    # Promoted to columns so the list can search without unpacking JSON.
    assert detail["name"] == "Layla Hassan"


def test_honeypot_is_accepted_but_never_stored(client, editor):
    before = len(editor.get("/api/admin/submissions").json()["items"])

    response = _submit(client, {**CONTACT, "name": "Spam Bot", "website": "http://spam"})
    # 202, so a bot learns nothing about which submissions were dropped.
    assert response.status_code == 202

    items = editor.get("/api/admin/submissions").json()["items"]
    assert len(items) == before
    assert not any(i["name"] == "Spam Bot" for i in items)


def test_instant_submissions_are_dropped(client, editor):
    response = _submit(client, {**CONTACT, "name": "Too Fast", "elapsed_ms": 120})
    assert response.status_code == 202
    items = editor.get("/api/admin/submissions").json()["items"]
    assert not any(i["name"] == "Too Fast" for i in items)


def test_a_missing_elapsed_time_is_not_punished(client, editor):
    # 0 means "the client did not tell us", not "instant" — a non-JS client
    # must still be able to get through.
    body = {k: v for k, v in CONTACT.items() if k != "elapsed_ms"}
    assert _submit(client, {**body, "name": "No Timer"}).status_code == 202
    items = editor.get("/api/admin/submissions").json()["items"]
    assert any(i["name"] == "No Timer" for i in items)


def test_malformed_and_oversized_input_is_rejected(client):
    assert _submit(client, {**CONTACT, "email": "not-an-email"}).status_code == 422
    assert _submit(client, {**CONTACT, "name": ""}).status_code == 422
    assert _submit(client, {**CONTACT, "message": "x" * 6000}).status_code == 422
    assert _submit(client, {**CONTACT, "surprise": "extra"}).status_code == 422
    assert _submit(client, {**CONTACT, "kind": "unknown"}).status_code == 422


def test_rate_limit_returns_429(client):
    # The per-IP hourly ceiling defaults to 10.
    codes = [_submit(client, CONTACT).status_code for _ in range(14)]
    assert 429 in codes


def test_opening_a_message_marks_it_read(client, editor):
    _submit(client, {**PROPOSAL, "name": "Read Me"})
    listing = editor.get("/api/admin/submissions?q=Read Me").json()
    item = listing["items"][0]
    assert item["status"] == "unread"

    editor.get(f"/api/admin/submissions/{item['id']}")
    after = editor.get("/api/admin/submissions?q=Read Me").json()["items"][0]
    assert after["status"] == "read"


def test_delete_is_soft_and_reversible(client, editor):
    _submit(client, {**CONTACT, "name": "Trash Me"})
    item = editor.get("/api/admin/submissions?q=Trash Me").json()["items"][0]

    editor.delete(f"/api/admin/submissions/{item['id']}")
    assert not any(
        i["name"] == "Trash Me"
        for i in editor.get("/api/admin/submissions").json()["items"]
    )
    assert any(
        i["name"] == "Trash Me"
        for i in editor.get("/api/admin/submissions?view=trash").json()["items"]
    )

    editor.post(f"/api/admin/submissions/{item['id']}/restore")
    assert any(
        i["name"] == "Trash Me"
        for i in editor.get("/api/admin/submissions").json()["items"]
    )


def test_csv_export_includes_the_payload(client, editor):
    _submit(client, {**CONTACT, "name": "Export Me"})
    response = editor.get("/api/admin/submissions/export.csv")

    assert response.status_code == 200
    assert "attachment" in response.headers["content-disposition"]
    assert "Export Me" in response.text


def test_the_inbox_is_not_public(client):
    assert client.get("/api/admin/submissions").status_code == 401
