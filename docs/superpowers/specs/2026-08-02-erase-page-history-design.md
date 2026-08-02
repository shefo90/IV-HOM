# Letting an admin permanently erase page history entries

**Date:** 2026-08-02
**Branch:** `erase-page-history`

## Goal

Give **admins** a way to permanently erase entries from a page's Change history panel, so
the panel does not become unusable after a run of rapid saves.

"Permanently erase" is meant literally: the git commit is dropped, its objects are pruned,
and the erased version is no longer retrievable by any route — including by SHA. There is
no undo.

Two entries are **never** erasable: the **current** version and the **original** version.

## Current state

History is not a table. It is `git log` over `pages/<slug>.json` inside a single content
repo shared by all eight pages, mirrored to an offsite backup remote.

| Concern | Location |
| --- | --- |
| `git` CLI wrapper, `log`, `show`, `commit_paths`, `push` | `api/app/gitrepo.py` |
| Write + commit + dist rebuild under one lock | `api/app/store.py:58` (`write_page`) |
| `history`, `at/{sha}`, `restore` routes | `api/app/routers/content.py:75-121` |
| Typed client | `src/admin/api.ts:132-139` |
| Panel UI | `src/admin/HistoryPanel.tsx` |
| Session (`role`) held here, not passed down | `src/admin/AdminApp.tsx:20` |

Relevant properties of what exists:

- **Every save rewrites the whole JSON file** (`store.py:65`), so each commit is a
  whole-file replacement, not a small diff.
- **History only ever grows.** Restore writes a *new* commit rather than rewinding
  (`content.py:114`), which is why a restore is itself undoable.
- **The repo is linear.** Every commit is created by this application; there are no merges.
- **The root commit** (`Initialise content repository`) touches only `.gitignore`, so it
  never appears in any page's log.
- **`push()` uses `check=False`** (`gitrepo.py:114`) — a rejected push is silent today.
- `require_role("admin")` yields an admin-only dependency, since `require_role` lets admin
  satisfy any role but rejects an editor whose role is not in `allowed` (`auth.py:144`).

### Why the panel gets crowded

Each save is one commit. A short editing session produces a run of near-identical entries
— ten rows inside twenty minutes, all by the same author, is normal.

## Decisions

### D1. Erase by tree replay, not by rebase

Rebuild the branch with `git commit-tree`, reusing each kept commit's **exact tree** rather
than re-applying its patch. Dropped commits are simply not rebuilt.

```
before:   A ── B ── C ── D ── E (HEAD)
drop C:   A ── B ─────── D'── E' (HEAD)
```

`D'` carries `D`'s tree byte for byte; `E'` carries `E`'s.

**Rejected: `git rebase --onto`.** Because every save is a whole-file rewrite, each later
commit is a patch against the version being dropped. Rebasing would conflict on nearly
every subsequent edit to that page, and `-X theirs` can silently resolve in favour of stale
content.

**Rejected: orphan-branch truncate.** Flattens all history for all eight pages at once and
discards authorship. Too blunt for selective erasure.

Tree replay wins on four counts:

- **Cannot conflict.** Trees are copied, never merged; there is no patch application step.
- **Live content is provably unchanged**, and the code proves it (see D2).
- **Authorship survives.** Author name, email, and original timestamp are replayed.
- **Atomic.** The new chain is built as dangling objects; a single `git update-ref` is the
  only mutation. Any failure before that point leaves the repo untouched.

### D2. Verify the working tree is unchanged before moving the branch

Capture `HEAD^{tree}` before the rewrite, compare it to the new head's tree after, and
**raise without moving the branch** if they differ. This is the safety property that makes
the whole feature acceptable: an erase can never alter the live site.

### D3. Prune, or it is not an erase

Dropping the commit is not enough — the object survives and `git show <sha>` still works,
so `/at/{sha}` and `restore` would keep serving supposedly-deleted content.

Every rewrite therefore ends with:

```
git update-ref -d refs/remotes/backup/main   # else gc has a reason to keep them
git reflog expire --expire=now --all
git gc --prune=now
```

Two traps found while building this, both caught by tests:

- **A stale remote-tracking ref pins the objects.** `refs/remotes/backup/main` still
  points at the pre-rewrite head, which keeps every erased commit reachable, so `gc`
  correctly refuses to prune them. Without deleting it first, `/at/{sha}` still returned
  **200** after an "erase". The ref is only a cache of the last fetch.
- **`gc` runs unchecked**, so a failed prune would otherwise be silent. The rewrite
  finishes by re-checking each erased sha with `cat-file -e` and raising if any survive.
  Telling an admin their content is gone while it sits readable in the object store is the
  one failure this feature must not have.

### D4. Attribution shifts to the next surviving commit

Erasing a commit means its content change must be attributed somewhere, or the current file
would change. The next surviving commit absorbs it.

Erasing Ali's 12:43:44 edit makes the 12:43:53 entry appear to be the one that introduced
that text. This is inherent to erasure — the only alternative is rewinding the live page —
and it is accepted, not worked around.

### D5. Two entries are permanently protected

| Row | Rule | Reason |
| --- | --- | --- |
| Page's **newest** entry (`· current`) | Hard block | It *is* the live page; erasing it rewinds the public site |
| Page's **oldest** entry | Hard block | Product requirement: the original stays as a permanent floor |
| Repo `HEAD` | Hard block | Same as current, at repo level |
| Everything between | Erasable | |

"Original" was ambiguous between the live version and the seeded version, so **both** are
protected — each has an independent justification.

Blocks are enforced **in the API**, not by hiding buttons, so they hold against a direct
call.

### D6. SHAs change, so the panel must refetch

A rewrite changes the SHA of every commit after the erased one. Any SHA still on screen is
dead and its Restore button would 404. The panel refetches its whole list after every
erase, using its own reload rather than the existing `onRestored` callback, which closes
the panel.

### D7. Force-push the backup synchronously, leasing against a known head

After a rewrite the backup remote rejects the push as non-fast-forward. Because `push()`
uses `check=False`, that failure is **silent today** — every nightly backup would fail from
then on and nobody would learn of it until the backup was needed.

**Both** erase routes therefore push **synchronously** (not as a `BackgroundTask`) with
force, and report the outcome. If the push fails the erased content still exists offsite,
and the admin is told so. Without this, "permanently erased" is false the moment the
network hiccups.

A failed backup push does **not** fail the request — the local erase already succeeded and
is irreversible, so returning an error would misreport what happened. It surfaces as
`backupUpdated: false`.

**The flag is named for what it can actually promise.** A forced push removes the version
from the backup's *history*; it cannot gc someone else's repository, so the remote prunes
the objects on its own schedule. `backupUpdated: true` means the backup no longer
references the erased version — calling it `backupPurged` overclaimed.

**The lease is spelled out, not fetched.** The obvious implementation —
`fetch` to populate `refs/remotes/backup/main`, then `--force-with-lease` — is wrong here,
and a test caught it: the fetch drags the erased commits back out of the backup and into
the object store they were just pruned from, so `/at/{sha}` starts serving them again.
Instead the route captures `repo.head()` *before* the rewrite and pushes with
`--force-with-lease=main:<that head>`. No fetch, and a stronger guarantee — the expected
value is one we know rather than one we cached. If the lease fails (a remote with no `main`
yet), it falls back to an ordinary non-forced push, which is safe by construction.

### D8. `purge` computes its own set server-side

The bulk endpoint derives the set from the log itself (all entries minus first minus last)
rather than trusting a client-supplied list. This cannot be tricked, and cannot miss
entries beyond the panel's 30-row fetch limit.

## Design

### Git layer — `api/app/gitrepo.py`

**`_git()` gains `env` and `input` parameters.** Needed to feed commit messages via stdin
and to set `GIT_AUTHOR_*` / `GIT_COMMITTER_*`. `env` is merged over `os.environ`, not
replacing it, so `git` keeps its PATH and config.

**`ContentRepo.drop_commits(shas: set[str]) -> str`** — the rewrite. Holds `self.lock` for
the entire operation, so it can never interleave with a `write_page`.

1. `order = rev-list --reverse HEAD`. Raise `GitError` if any requested sha is absent.
2. `old_tree = rev-parse HEAD^{tree}`.
3. For each sha in `order`, skipping dropped ones:
   - Read `%an %ae %aI %cn %ce %cI` via `show -s --format=`, and `%B` for the message.
   - `tree = rev-parse <sha>^{tree}`.
   - `commit-tree <tree> [-p <new_parent>]` with the message on stdin and the identity in
     `env`. The result becomes `new_parent`.
4. If `rev-parse <new_head>^{tree}` != `old_tree`, raise `GitError`. **Branch not moved.**
5. `update-ref refs/heads/main <new_head>`.
6. `reset --hard <new_head>` — a no-op in content terms by construction (step 4 proved the
   tree is identical); it exists to keep index stat data consistent.
7. Delete `refs/remotes/backup/main`, `reflog expire --expire=now --all`, `gc --prune=now`.
8. Re-check every erased sha with `cat-file -e`; raise `GitError` if any still resolves.
9. Return `new_head`.

The root commit is never in a page's log (it touches only `.gitignore`), so the branch
always retains a root.

**`push(force_from: str | None = None)`** — when given the head the remote is expected to
be on, pushes with `--force-with-lease=main:<force_from>` and no fetch (see D7), falling
back to an ordinary push if the lease fails. Returns a bool so the caller can report the
outcome; `push()` with no argument keeps its current fire-and-forget behaviour.

### Routes — `api/app/routers/content.py`

```
DELETE /api/admin/content/{slug}/history/{sha}
POST   /api/admin/content/{slug}/history/purge
```

Both use `Admin = Depends(require_role("admin"))`. Editors receive 403.

Both return:

```json
{ "slug": "home", "erased": ["<sha>"], "head": "<new sha>", "backupUpdated": true }
```

Validation for the single delete, in order:

| Condition | Response |
| --- | --- |
| Unknown slug | 404 `Unknown page '<slug>'` |
| sha not in this page's log | 404 `That version is not in this page's history` |
| sha is the page's newest entry | 400 `The current version cannot be erased` |
| sha is the page's oldest entry | 400 `The original version cannot be erased` |
| sha is repo `HEAD` | 400 `The current version cannot be erased` |

The page-log membership check is what stops this route being used to erase another page's
history. Both routes read the log with `limit=1000` rather than the 30-row default, so the
oldest-entry check stays correct for a page with more than 30 entries. `get_history` keeps
its existing `min(limit, 100)` cap — the raised limit is internal to the erase paths.

A `GitError` from `drop_commits` becomes a 500. By D2 the branch has not moved when that
happens, so the repo is unchanged and the client may safely retry.

`purge` derives its set as `log[1:-1]`. When that set is empty it is a no-op returning
`"erased": []`, not an error.

Neither route calls `rebuild_dist()` — D2 guarantees the tree is unchanged, so `dist` is
already correct.

### Client — `src/admin/api.ts`

```ts
eraseVersion: (slug: string, sha: string) =>
  request<PurgeResult>(`/api/admin/content/${slug}/history/${sha}`, { method: "DELETE" }),
clearOlderHistory: (slug: string) =>
  request<PurgeResult>(`/api/admin/content/${slug}/history/purge`, { method: "POST" }),
```

with `interface EraseResult { erased: string[]; head: string; backupUpdated: boolean }`.

### UI — `src/admin/HistoryPanel.tsx`

Thread `isAdmin` from `AdminApp` (which holds `session`) through `PageEditor` into
`HistoryPanel`. `PageEditor` gains an `isAdmin` prop and passes it straight through.

- `×` on every row except the first and last, rendered only when `isAdmin`.
- `CLEAR OLDER · N` in the panel header, shown only when `isAdmin` and `commits.length > 2`.
- Confirm copy states the finality plainly:
  - single: *"Permanently erase this version? It cannot be recovered."*
  - bulk: *"Permanently erase N older versions of this page? The current and original
    versions are kept. This cannot be undone."*
- On success: refetch the history list (D6).
- When `backupUpdated` is false, show a warning: *"Erased here, but the offsite backup
  could not be updated and still holds it."*
- The busy key is `restore:<sha>` / `erase:<sha>` / `purge`, not a bare sha — otherwise a
  row's two buttons both light up for whichever one was clicked.

Extracting the fetch into a `reload()` callback that both the mount effect and the erase
handlers call keeps `HistoryPanel` a single-purpose component; no other file needs to know
about SHAs changing.

## Testing

`api/tests/test_history_erase.py` — its own file rather than an addition to
`test_content.py`, matching the repo's one-file-per-concern layout. Uses the existing
`admin` and `editor` fixtures.

| Test | Asserts |
| --- | --- |
| editor calls either endpoint | 403 |
| erase a middle version | gone from the log, **and page content byte-identical** |
| erase the current version | 400 |
| erase the original version | 400 |
| erase a sha belonging to another page | 404 **on the message, not just the code** |
| erase an unknown sha | 404 on the message |
| `GET /at/{sha}` for an erased sha | 404 — proves `gc` really removed it |
| a rewrite | kills later shas, leaves earlier ones valid |
| `purge` | leaves exactly two entries — current and original |
| `purge` with nothing to erase | 200, `erased: []` |
| another page after a rewrite | content unchanged |
| erase with a real backup remote | erased version no longer an ancestor of remote `main` |
| erase with a stale `refs/remotes/backup/main` | still pruned — `/at/{sha}` 404s |

The byte-identical assertion is what catches a regression in D2; the `/at/{sha}` 404s catch
D3. The two 404-message assertions exist because a *missing route* also returns 404 — the
plain status check passed before either endpoint existed, proving nothing.

Tests create their own history first (several `PUT`s) so there is a middle version to
erase, following `test_restore_brings_back_a_previous_version_as_a_new_commit`.

The erase tests avoid the `process` page. Its seeded content used to fail schema validation
outright — a separate, pre-existing bug found while building this and fixed alongside it
(`specs` was locked at exactly 3 with both fields required, but three of the four machines
were padded with blank entries). `test_every_seeded_page_can_be_saved_unchanged` in
`test_content.py` now guards the whole class of problem.

## Out of scope

- Erasing history for **all** pages at once. Per-page only.
- An audit trail of erasures. Writing one into the repo would add the very rows this
  feature removes.
- Any change to how saves create commits (no debounce, no commit amending).
- Recovering an erased version. There is deliberately no undo.
