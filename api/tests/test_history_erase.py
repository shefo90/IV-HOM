"""
Permanently erasing history entries.

This is the one destructive operation in the CMS, so the tests care about two
things above all: that an erase never moves the live content, and that an
erased version is really gone rather than merely unlinked.
"""

from __future__ import annotations

import copy
import subprocess

from app.store import repo

PAGES = ("site", "home", "about", "projects", "contact", "process", "factory", "products")


def _edit(client, slug: str, value: str) -> None:
    page = client.get(f"/api/admin/content/{slug}").json()
    page["subhero"]["eyebrow"] = value
    assert client.put(f"/api/admin/content/{slug}", json=page).status_code == 200


def _history(client, slug: str) -> list[dict]:
    return client.get(f"/api/admin/content/{slug}/history").json()


def test_an_editor_cannot_erase_a_version(editor):
    sha = _history(editor, "products")[-1]["sha"]
    assert editor.delete(f"/api/admin/content/products/history/{sha}").status_code == 403


def test_an_editor_cannot_purge_history(editor):
    assert editor.post("/api/admin/content/products/history/purge").status_code == 403


def test_erasing_a_middle_version_leaves_the_page_content_untouched(admin):
    _edit(admin, "products", "erase-me")
    _edit(admin, "products", "and-then-this")

    before = copy.deepcopy(admin.get("/api/admin/content/products").json())
    history = _history(admin, "products")
    middle = history[1]["sha"]

    response = admin.delete(f"/api/admin/content/products/history/{middle}")
    assert response.status_code == 200
    assert response.json()["erased"] == [middle]
    # No backup remote is configured in tests, so there is no offsite copy left
    # holding the erased version.
    assert response.json()["backupUpdated"] is True

    after = _history(admin, "products")
    assert middle not in {c["sha"] for c in after}
    assert len(after) == len(history) - 1
    # The whole point of replaying trees rather than rebasing: the live page
    # cannot move.
    assert admin.get("/api/admin/content/products").json() == before


def test_an_erased_version_is_no_longer_retrievable_by_sha(admin):
    _edit(admin, "contact", "soon-to-be-erased")
    _edit(admin, "contact", "newer")

    middle = _history(admin, "contact")[1]["sha"]
    assert admin.get(f"/api/admin/content/contact/at/{middle}").status_code == 200

    assert admin.delete(f"/api/admin/content/contact/history/{middle}").status_code == 200

    # If gc had not pruned the object, git would still happily show it.
    assert admin.get(f"/api/admin/content/contact/at/{middle}").status_code == 404


def test_the_current_version_cannot_be_erased(admin):
    _edit(admin, "about", "current-guard")

    current = _history(admin, "about")[0]["sha"]
    response = admin.delete(f"/api/admin/content/about/history/{current}")

    assert response.status_code == 400
    assert "current" in response.json()["detail"].lower()


def test_the_original_version_cannot_be_erased(admin):
    _edit(admin, "about", "original-guard")

    original = _history(admin, "about")[-1]["sha"]
    response = admin.delete(f"/api/admin/content/about/history/{original}")

    assert response.status_code == 400
    assert "original" in response.json()["detail"].lower()


def test_a_version_belonging_to_another_page_cannot_be_erased(admin):
    _edit(admin, "contact", "not-yours")
    _edit(admin, "contact", "newer")

    someone_elses = _history(admin, "contact")[1]["sha"]
    # The sha is a perfectly real commit — it just is not part of this page's
    # history, which is what stops this route reaching across pages.
    response = admin.delete(f"/api/admin/content/factory/history/{someone_elses}")

    assert response.status_code == 404
    # Asserted on the message, not just the code: a missing route 404s too, and
    # that would make this test pass without the guard existing.
    assert "not in this page's history" in response.json()["detail"]


def test_erasing_an_unknown_sha_is_a_404(admin):
    response = admin.delete(f"/api/admin/content/products/history/{'0' * 40}")

    assert response.status_code == 404
    assert "not in this page's history" in response.json()["detail"]


def test_purge_leaves_only_the_current_and_original_versions(admin):
    for n in range(3):
        _edit(admin, "projects", f"noise {n}")
    assert len(_history(admin, "projects")) > 2

    original = _history(admin, "projects")[-1]["sha"]
    before = copy.deepcopy(admin.get("/api/admin/content/projects").json())

    response = admin.post("/api/admin/content/projects/history/purge")
    assert response.status_code == 200

    after = _history(admin, "projects")
    # Exactly two, because these edits were consecutive. Had another page been
    # saved in between, that commit would inherit the erased change and surface
    # in this log — the attribution shift is inherent to erasing.
    assert len(after) == 2
    # The original precedes everything dropped, so it is never rebuilt and keeps
    # its sha; the current entry was replayed onto a new parent and has a new one.
    assert after[-1]["sha"] == original
    assert admin.get("/api/admin/content/projects").json() == before


def test_purging_a_page_with_nothing_to_erase_is_a_no_op(admin):
    admin.post("/api/admin/content/projects/history/purge")

    response = admin.post("/api/admin/content/projects/history/purge")
    assert response.status_code == 200
    assert response.json()["erased"] == []
    assert len(_history(admin, "projects")) == 2


def test_a_rewrite_leaves_every_other_page_untouched(admin):
    _edit(admin, "factory", "rewrite trigger")
    _edit(admin, "factory", "newer")

    before = {slug: admin.get(f"/api/admin/content/{slug}").json() for slug in PAGES}

    middle = _history(admin, "factory")[1]["sha"]
    assert admin.delete(f"/api/admin/content/factory/history/{middle}").status_code == 200

    after = {slug: admin.get(f"/api/admin/content/{slug}").json() for slug in PAGES}
    assert after == before


def test_a_rewrite_kills_the_shas_of_every_later_version(admin):
    _edit(admin, "products", "keep me")
    keep_content = copy.deepcopy(admin.get("/api/admin/content/products").json())
    _edit(admin, "products", "drop me")
    _edit(admin, "products", "newest")

    history = _history(admin, "products")
    keep, drop, newest = history[2]["sha"], history[1]["sha"], history[0]["sha"]

    assert admin.delete(f"/api/admin/content/products/history/{drop}").status_code == 200

    # Only commits *after* the erased one are rebuilt, so the newest entry's sha
    # is now dead while the older one survives untouched. A panel still showing
    # the pre-erase list would offer a Restore button that 404s — which is why
    # it refetches.
    assert admin.post(
        "/api/admin/content/products/restore", json={"sha": newest}
    ).status_code == 404

    restored = admin.post("/api/admin/content/products/restore", json={"sha": keep})
    assert restored.status_code == 200
    assert admin.get("/api/admin/content/products").json() == keep_content


def test_an_erase_drops_the_version_from_the_offsite_backup(admin, tmp_path, monkeypatch):
    bare = tmp_path / "backup.git"
    subprocess.run(["git", "init", "--bare", str(bare)], check=True, capture_output=True)
    monkeypatch.setattr(repo, "backup_remote", str(bare))

    _edit(admin, "about", "backup me")
    _edit(admin, "about", "erase me")
    _edit(admin, "about", "newest")

    # Get the remote in step first, the way the nightly cron would.
    assert repo.push() is True

    middle = _history(admin, "about")[1]["sha"]
    response = admin.delete(f"/api/admin/content/about/history/{middle}")

    assert response.status_code == 200
    assert response.json()["backupUpdated"] is True

    # An ordinary push would have been rejected as non-fast-forward, leaving the
    # erased version sitting offsite.
    still_there = subprocess.run(
        ["git", "merge-base", "--is-ancestor", middle, "main"], cwd=bare, capture_output=True
    )
    assert still_there.returncode != 0


def test_a_stale_backup_ref_cannot_keep_an_erased_version_alive(admin, tmp_path, monkeypatch):
    bare = tmp_path / "backup.git"
    subprocess.run(["git", "init", "--bare", str(bare)], check=True, capture_output=True)
    monkeypatch.setattr(repo, "backup_remote", str(bare))

    _edit(admin, "about", "first")
    assert repo.push() is True
    # The fetch inside a forced push leaves a remote-tracking ref behind. Point
    # it at the current head and then move on: it is now stale, and it would
    # keep everything it references reachable — so gc would refuse to prune the
    # objects an erase is supposed to destroy.
    repo._git("update-ref", "refs/remotes/backup/main", repo.head())

    _edit(admin, "about", "erase me")
    _edit(admin, "about", "newest")

    middle = _history(admin, "about")[1]["sha"]
    assert admin.delete(f"/api/admin/content/about/history/{middle}").status_code == 200

    assert admin.get(f"/api/admin/content/about/at/{middle}").status_code == 404
