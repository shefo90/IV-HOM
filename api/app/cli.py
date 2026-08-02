"""
Operator commands: `python -m app.cli <command>`.

Seeding, account management, and the retention purge. Seeding goes through the
same store.write_page() the API uses, so the first commit looks exactly like
every later edit.
"""

from __future__ import annotations

import argparse
import getpass
import json
import shutil
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .auth import ROLES, create_user, delete_user, list_users
from .config import settings
from .db import connect, init_db
from .store import rebuild_dist, repo, write_page

# Baked into the image at build time from src/content/fallback.json and
# public/media/ — see api/Dockerfile.
SEED_DIR = Path(__file__).parent.parent / "seed"


def cmd_seed(args: argparse.Namespace) -> int:
    content_file = Path(args.content or SEED_DIR / "fallback.json")
    media_dir = Path(args.media or SEED_DIR / "media")

    if not content_file.exists():
        print(f"No seed content at {content_file}", file=sys.stderr)
        return 1

    repo.ensure_initialised()

    if settings.pages_dir.glob("*.json") and any(settings.pages_dir.glob("*.json")):
        if not args.force:
            print("Content already present. Re-run with --force to overwrite.")
            return 1

    documents = json.loads(content_file.read_text(encoding="utf-8"))

    copied = 0
    if media_dir.exists():
        settings.media_dir.mkdir(parents=True, exist_ok=True)
        for source in media_dir.iterdir():
            if source.is_file():
                shutil.copy2(source, settings.media_dir / source.name)
                copied += 1
        with repo.lock:
            repo.commit_paths(["media"], "Seed media library", None)

    for slug, data in documents.items():
        write_page(slug, data, f"Seed {slug}", None)

    print(f"Seeded {len(documents)} document(s) and {copied} image(s).")
    return 0


def cmd_create_user(args: argparse.Namespace) -> int:
    password = args.password or getpass.getpass("Password: ")
    if len(password) < 12:
        print("Use at least 12 characters.", file=sys.stderr)
        return 1
    create_user(args.email, password, args.name, args.role)
    print(f"Created {args.email} ({args.role}).")
    return 0


def cmd_delete_user(args: argparse.Namespace) -> int:
    if not delete_user(args.email):
        print(f"No such user: {args.email}", file=sys.stderr)
        return 1
    print(f"Deleted {args.email}.")
    return 0


def cmd_list_users(_: argparse.Namespace) -> int:
    users = list_users()
    if not users:
        print("No users yet. Create one with: python -m app.cli create-user ...")
        return 0
    for user in users:
        print(f"{user.role:<7} {user.email:<32} {user.name}")
    return 0


def cmd_purge(_: argparse.Namespace) -> int:
    init_db()
    cutoff = (
        datetime.now(timezone.utc) - timedelta(days=settings.trash_retention_days)
    ).isoformat(timespec="seconds")
    with connect() as conn:
        removed = conn.execute(
            "DELETE FROM submissions WHERE deleted_at IS NOT NULL AND deleted_at < ?",
            (cutoff,),
        ).rowcount
    print(f"Purged {removed} trashed submission(s) older than {cutoff}.")
    return 0


def cmd_rebuild(_: argparse.Namespace) -> int:
    repo.ensure_initialised()
    rebuild_dist()
    print(f"Wrote {settings.dist_file}")
    return 0


def cmd_backup(_: argparse.Namespace) -> int:
    if not settings.backup_remote:
        print("IV_BACKUP_REMOTE is not set; nothing to push.", file=sys.stderr)
        return 1
    repo.push()
    print("Pushed content to the backup remote.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="app.cli")
    sub = parser.add_subparsers(dest="command", required=True)

    seed = sub.add_parser("seed", help="import the initial content and media")
    seed.add_argument("--content", help="path to fallback.json")
    seed.add_argument("--media", help="directory of images")
    seed.add_argument("--force", action="store_true", help="overwrite existing content")
    seed.set_defaults(func=cmd_seed)

    create = sub.add_parser("create-user")
    create.add_argument("email")
    create.add_argument("--name", required=True)
    create.add_argument("--role", choices=ROLES, default="editor")
    create.add_argument("--password", help="prompted for when omitted")
    create.set_defaults(func=cmd_create_user)

    remove = sub.add_parser("delete-user")
    remove.add_argument("email")
    remove.set_defaults(func=cmd_delete_user)

    sub.add_parser("list-users").set_defaults(func=cmd_list_users)
    sub.add_parser("purge", help="delete trashed submissions past retention").set_defaults(func=cmd_purge)
    sub.add_parser("rebuild", help="regenerate dist/content.json").set_defaults(func=cmd_rebuild)
    sub.add_parser("backup", help="push the content repo to the backup remote").set_defaults(func=cmd_backup)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
