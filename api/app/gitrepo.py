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

    def _git(self, *args: str, check: bool = True) -> str:
        proc = subprocess.run(
            ["git", *args],
            cwd=self.root,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        if check and proc.returncode != 0:
            raise GitError(f"git {' '.join(args)}: {proc.stderr.strip()}")
        return proc.stdout

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

    def push(self) -> None:
        """
        Best effort. Called in a background task after a save, so a network
        failure can never fail the client's edit; the nightly cron is the
        real guarantee.
        """
        if not self.backup_remote:
            return
        remotes = self._git("remote").split()
        if "backup" not in remotes:
            self._git("remote", "add", "backup", self.backup_remote)
        else:
            self._git("remote", "set-url", "backup", self.backup_remote)
        self._git("push", "backup", "main", check=False)

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
