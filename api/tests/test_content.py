"""
Content editing, and the guardrails that matter.

Every guardrail is asserted at the API, not in the form: the admin UI is a
convenience and the API is the boundary.
"""

from __future__ import annotations

import copy


def test_schema_covers_every_document(editor):
    schema = editor.get("/api/schema").json()
    slugs = {d["slug"] for d in schema["documents"]}
    assert slugs == {
        "site", "home", "about", "projects", "contact", "process", "factory", "products",
    }


def test_edit_round_trips_and_lands_in_git(editor):
    page = editor.get("/api/admin/content/about").json()
    page["subhero"]["eyebrow"] = "About IV, edited"

    saved = editor.put("/api/admin/content/about", json=page)
    assert saved.status_code == 200
    assert saved.json()["changed"] is True

    assert editor.get("/api/admin/content/about").json()["subhero"]["eyebrow"] == (
        "About IV, edited"
    )

    history = editor.get("/api/admin/content/about/history").json()
    assert history[0]["message"] == "Update about"
    # Attribution comes from the signed-in user, so the log reads as an audit trail.
    assert history[0]["email"] == "editor@test.com"


def test_saving_an_unchanged_page_is_a_no_op(editor):
    page = editor.get("/api/admin/content/contact").json()
    assert editor.put("/api/admin/content/contact", json=page).json()["changed"] is False


def test_blank_required_heading_is_rejected(editor):
    page = editor.get("/api/admin/content/projects").json()
    page["subhero"]["heading"] = "   "

    response = editor.put("/api/admin/content/projects", json=page)
    assert response.status_code == 422
    assert any("subhero.heading" in e for e in response.json()["detail"]["errors"])


def test_a_fifth_stat_is_rejected_by_the_locked_list_bounds(editor):
    page = editor.get("/api/admin/content/about").json()
    page["stats"].append({"index": "N 5", "value": "99", "label": "Extra"})

    response = editor.put("/api/admin/content/about", json=page)
    assert response.status_code == 422
    assert any("at most 4" in e for e in response.json()["detail"]["errors"])


def test_unknown_fields_are_rejected(editor):
    page = editor.get("/api/admin/content/contact").json()
    page["injected"] = "nope"

    response = editor.put("/api/admin/content/contact", json=page)
    assert response.status_code == 422
    assert any("unknown field" in e for e in response.json()["detail"]["errors"])


def test_image_fields_only_accept_uploaded_media_paths(editor):
    page = editor.get("/api/admin/content/about").json()
    page["subhero"]["image"] = "https://evil.example.com/x.jpg"

    response = editor.put("/api/admin/content/about", json=page)
    assert response.status_code == 422

    page["subhero"]["image"] = "/media/../../etc/passwd"
    assert editor.put("/api/admin/content/about", json=page).status_code == 422


def test_every_error_is_reported_at_once(editor):
    page = editor.get("/api/admin/content/projects").json()
    page["subhero"]["heading"] = ""
    page["subhero"]["eyebrow"] = ""

    errors = editor.put("/api/admin/content/projects", json=page).json()["detail"]["errors"]
    # Otherwise the client fixes one field, resubmits, and finds the next.
    assert len(errors) >= 2


def test_restore_brings_back_a_previous_version_as_a_new_commit(editor):
    original = editor.get("/api/admin/content/factory").json()
    before = copy.deepcopy(original)

    original["capacity"]["eyebrow"] = "1 - Scale, edited"
    editor.put("/api/admin/content/factory", json=original)

    history = editor.get("/api/admin/content/factory/history").json()
    target = history[1]["sha"]

    restored = editor.post("/api/admin/content/factory/restore", json={"sha": target})
    assert restored.status_code == 200

    assert editor.get("/api/admin/content/factory").json() == before
    # History only grows: a restore can itself be undone.
    assert len(editor.get("/api/admin/content/factory/history").json()) == len(history) + 1


def test_an_unlocked_list_accepts_any_count_within_its_bounds(editor):
    """`specs` is the one list an editor may resize, so both ends must work."""
    page = editor.get("/api/admin/content/process").json()

    page["tech"]["items"][0]["specs"] = [{"label": "Tolerance", "value": "< 0.5 mm"}]
    assert editor.put("/api/admin/content/process", json=page).status_code == 200

    page["tech"]["items"][0]["specs"] = [
        {"label": "Tolerance", "value": "< 0.5 mm"},
        {"label": "Bed", "value": "3060 x 2050"},
        {"label": "Axes", "value": "5"},
    ]
    assert editor.put("/api/admin/content/process", json=page).status_code == 200


def test_an_unlocked_list_still_has_bounds(editor):
    page = editor.get("/api/admin/content/process").json()

    page["tech"]["items"][0]["specs"] = []
    assert editor.put("/api/admin/content/process", json=page).status_code == 422

    page["tech"]["items"][0]["specs"] = [
        {"label": f"Spec {n}", "value": str(n)} for n in range(4)
    ]
    assert editor.put("/api/admin/content/process", json=page).status_code == 422


def test_every_seeded_page_can_be_saved_unchanged(editor):
    """
    A page the validator rejects as-is cannot be edited at all — the editor
    opens it, changes one word, and is told eight other fields are wrong.

    Asserted for every page rather than the one that regressed, because the
    failure mode is a schema that describes the shape of the seed data instead
    of what the content actually means.
    """
    schema = editor.get("/api/schema").json()

    for document in schema["documents"]:
        slug = document["slug"]
        page = editor.get(f"/api/admin/content/{slug}").json()

        response = editor.put(f"/api/admin/content/{slug}", json=page)
        assert response.status_code == 200, (slug, response.json())


def test_unknown_page_is_a_404(editor):
    assert editor.get("/api/admin/content/nope").status_code == 404
