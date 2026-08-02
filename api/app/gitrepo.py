"""
Git as the content datastore.

A thin wrapper over the `git` CLI rather than GitPython or pygit2: the CLI is
predictable, needs no extra dependency, and any failure can be reproduced by
hand in the container.

Every write is guarded by a file lock on the volume, so two saves can never
interleave a half-written file with a commit. Callers are plain `def` route
handlers, which FastAPI runs in its threadpool — blocking git calls therefore
never stall the event loop.
"""

from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass
from pathlib import Path

from filelock import FileLock


class GitError(RuntimeError):
    pass


@dataclass
class Commit:
    sha: str
    author: str
    email: str
    when: str
    message: str


class ContentRepo:
    def __init__(self, root: Path, lock_file: Path, backup_remote: str = ""):
        self.root = root
        self.backup_remote = backup_remote
        lock_file.parent.mkdir(parents=True, exist_ok=True)
        self._lock = FileLock(str(lock_file), timeout=30)

    # ------------------------------------------------------------------ core

    def _git(
        self,
        *args: str,
        check: bool = True,
        env: dict[str, str] | None = None,
        stdin: str | None = None,
    ) -> str:
        proc = subprocess.run(
            ["git", *args],
            cwd=self.root,
            capture_output=True,
            text=True,
            encoding="utf-8",
            # Merged over the real environment, never replacing it: git still
            # needs PATH and its own configuration to run at all.
            env={**os.environ, **env} if env else None,
            input=stdin,
        )
        if check and proc.returncode != 0:
            raise GitError(f"git {' '.join(args)}: {proc.stderr.strip()}")
        return proc.stdout

    def _git_ok(self, *args: str, **kwargs) -> bool:
        try:
            self._git(*args, **kwargs)
            return True
        except GitError:
            return False

    @property
    def lock(self) -> FileLock:
        return self._lock

    def ensure_initialised(self) -> None:
        """Create the repo on first boot. Safe to call every start-up."""
        self.root.mkdir(parents=True, exist_ok=True)
        (self.root / "pages").mkdir(exist_ok=True)
        (self.root / "media").mkdir(exist_ok=True)
        (self.root / "dist").mkdir(exist_ok=True)

        if not (self.root / ".git").exists():
            self._git("init", "-b", "main")
            # The container user differs from the volume owner often enough
            # that git refuses to operate without this.
            self._git("config", "--local", "safe.directory", str(self.root))
            self._git("config", "--local", "user.name", "IV CMS")
            self._git("config", "--local", "user.email", "cms@ivfixed.com")
            # The merged payload is a build artefact of the pages; keeping it
            # out of history stops every save producing a duplicate diff.
            (self.root / ".gitignore").write_text("dist/\n", encoding="utf-8")
            self._git("add", ".gitignore")
            self._git("commit", "-m", "Initialise content repository", check=False)

    # ----------------------------------------------------------------- write

    def commit_paths(self, paths: list[str], message: str, author: str | None) -> str | None:
        """
        Stage and commit. Returns the new sha, or None when nothing changed
        (saving an unedited page is a no-op, not an error).
        """
        self._git("add", "--", *paths)
        if not self._git("diff", "--cached", "--name-only").strip():
            return None

        args = ["commit", "-m", message]
        if author:
            args += ["--author", author]
        self._git(*args)
        return self.head()

    def head(self) -> str:
        return self._git("rev-parse", "HEAD").strip()

    def push(self, force_from: str | None = None) -> bool:
        """
        Best effort. Called in a background task after a save, so a network
        failure can never fail the client's edit; the nightly cron is the
        real guarantee.

        `force_from` is the head the remote is expected to be sitting on, and is
        passed after an erase — the remote then holds commits that no longer
        exist here and would reject an ordinary push as non-fast-forward.

        Returns whether the remote is now in step. Note what that does and does
        not mean: the erased version stops being part of the backup's history,
        and the remote prunes it on its own schedule. We cannot gc someone
        else's repository. What matters is that the caller learns when the push
        did not land at all, because then the backup still serves the version
        the admin just erased.
        """
        if not self.backup_remote:
            # Nothing offsite to fall out of step, or to still be holding an
            # erased version.
            return True

        remotes = self._git("remote").split()
        if "backup" not in remotes:
            self._git("remote", "add", "backup", self.backup_remote)
        else:
            self._git("remote", "set-url", "backup", self.backup_remote)

        if force_from is None:
            return self._git_ok("push", "backup", "main")

        # The lease is spelled out rather than read from a remote-tracking ref,
        # because populating that ref means fetching — and the fetch would drag
        # the erased commits back out of the backup and into the object store we
        # just pruned them from.
        #
        # Not a bare --force either: if the remote is not where we left it,
        # somebody else has pushed, and failing loudly beats discarding it.
        if self._git_ok("push", f"--force-with-lease=main:{force_from}", "backup", "main"):
            return True

        # A remote with no `main` yet fails the lease but needs no force at all.
        return self._git_ok("push", "backup", "main")

    # ------------------------------------------------------------------ read

    def log(self, rel_path: str, limit: int = 30) -> list[Commit]:
        # Unit separator between fields, record separator between commits:
        # neither can appear in a name or a subject line.
        fmt = "%H\x1f%an\x1f%ae\x1f%aI\x1f%s\x1e"
        raw = self._git("log", f"--format={fmt}", f"-{limit}", "--", rel_path)

        commits = []
        for record in raw.split("\x1e"):
            record = record.strip("\n")
            if not record:
                continue
            sha, author, email, when, message = record.split("\x1f")
            commits.append(Commit(sha, author, email, when, message))
        return commits

    def show(self, sha: str, rel_path: str) -> str:
        return self._git("show", f"{sha}:{rel_path}")

    # ---------------------------------------------------------------- destroy

    def _replay(self, sha: str, parent: str | None) -> str:
        """Recreate one commit on a new parent, keeping its tree verbatim."""
        author_name, author_email, authored, committer, committer_email, committed = (
            self._git("show", "-s", "--format=%an\x1f%ae\x1f%aI\x1f%cn\x1f%ce\x1f%cI", sha)
            .strip("\n")
            .split("\x1f")
        )
        message = self._git("show", "-s", "--format=%B", sha)
        tree = self._git("rev-parse", f"{sha}^{{tree}}").strip()

        args = ["commit-tree", tree]
        if parent:
            args += ["-p", parent]

        return self._git(
            *args,
            stdin=message,
            env={
                "GIT_AUTHOR_NAME": author_name,
                "GIT_AUTHOR_EMAIL": author_email,
                "GIT_AUTHOR_DATE": authored,
                "GIT_COMMITTER_NAME": committer,
                "GIT_COMMITTER_EMAIL": committer_email,
                "GIT_COMMITTER_DATE": committed,
            },
        ).strip()

    def drop_commits(self, shas: set[str]) -> str:
        """
        Erase commits for good, and return the new head.

        Each surviving commit is rebuilt around its *exact tree* rather than by
        replaying its patch. Every save here rewrites the whole JSON file, so a
        rebase would apply each later commit as a patch against the version
        being dropped and conflict almost at once. Copying trees cannot
        conflict, and it makes the working tree provably unchanged — which is
        asserted below, before the branch is allowed to move.

        Nothing is mutated until the final `update-ref`: the new chain is built
        as dangling objects, so a failure anywhere above leaves the repository
        exactly as it was.
        """
        if not shas:
            return self.head()

        with self._lock:
            order = self._git("rev-list", "--reverse", "HEAD").split()
            position = {sha: i for i, sha in enumerate(order)}

            missing = shas - position.keys()
            if missing:
                raise GitError(f"not in history: {', '.join(sorted(missing))}")

            old_tree = self._git("rev-parse", "HEAD^{tree}").strip()

            # Commits before the first erasure are untouched, so they keep their
            # shas. Only what follows has to be rebuilt.
            start = min(position[sha] for sha in shas)
            parent = order[start - 1] if start else None

            for sha in order[start:]:
                if sha not in shas:
                    parent = self._replay(sha, parent)

            if parent is None:
                raise GitError("refusing to erase every commit in the repository")

            if self._git("rev-parse", f"{parent}^{{tree}}").strip() != old_tree:
                raise GitError("erase would have changed the live content")

            self._git("update-ref", "refs/heads/main", parent)
            # A no-op in content terms — the check above proved the tree is
            # identical — but it keeps the index and its stat cache in step.
            self._git("reset", "--hard", parent)

            # Unreferenced is not gone: until the reflog is dropped and the
            # objects pruned, `git show <sha>` still serves the erased version
            # and the restore route would happily bring it back.
            #
            # The remote-tracking ref has to go first. It still points at the
            # pre-rewrite head, which keeps every erased commit reachable, and
            # gc will not prune what a ref can reach. It is only a cache of the
            # last fetch, so dropping it costs nothing.
            self._git("update-ref", "-d", "refs/remotes/backup/main", check=False)
            self._git("reflog", "expire", "--expire=now", "--all")
            self._git("gc", "--prune=now", check=False)

            # gc runs unchecked, so this is the only thing standing between a
            # failed prune and telling the admin their content is gone when it
            # is still sitting in the object store.
            survivors = [sha for sha in sorted(shas) if self._exists(sha)]
            if survivors:
                raise GitError(
                    "removed from history, but these versions could not be pruned "
                    f"and can still be read: {', '.join(s[:8] for s in survivors)}"
                )

            return parent

    def _exists(self, sha: str) -> bool:
        return self._git_ok("cat-file", "-e", f"{sha}^{{commit}}")
