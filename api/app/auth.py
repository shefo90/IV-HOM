"""
Admin authentication.

Two users, so the store is a JSON file rather than a table. It lives outside
the content repo on purpose — that repo is pushed to a backup remote, and
password hashes must not travel with it.

The session is a JWT in an httpOnly, SameSite=Strict cookie rather than
localStorage: same token, but script on the page cannot read it, which removes
the XSS token-theft path.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError
from fastapi import Cookie, Depends, HTTPException, Response, status

from .config import settings

COOKIE_NAME = "iv_session"
ALGORITHM = "HS256"
ROLES = ("admin", "editor")

_hasher = PasswordHasher()


@dataclass
class User:
    email: str
    name: str
    role: str

    @property
    def git_author(self) -> str:
        return f"{self.name} <{self.email}>"


# ------------------------------------------------------------------ user store


def _load_users() -> dict[str, dict]:
    if not settings.users_file.exists():
        return {}
    return json.loads(settings.users_file.read_text(encoding="utf-8"))


def _save_users(users: dict[str, dict]) -> None:
    settings.users_file.parent.mkdir(parents=True, exist_ok=True)
    settings.users_file.write_text(json.dumps(users, indent=2), encoding="utf-8")
    # Readable only by the owner: it holds password hashes.
    try:
        os.chmod(settings.users_file, 0o600)
    except OSError:
        # Bind mounts on some hosts reject chmod; not fatal.
        pass


def create_user(email: str, password: str, name: str, role: str) -> None:
    if role not in ROLES:
        raise ValueError(f"role must be one of {ROLES}")
    users = _load_users()
    users[email.lower()] = {
        "email": email.lower(),
        "name": name,
        "role": role,
        "hash": _hasher.hash(password),
    }
    _save_users(users)


def delete_user(email: str) -> bool:
    users = _load_users()
    if users.pop(email.lower(), None) is None:
        return False
    _save_users(users)
    return True


def list_users() -> list[User]:
    return [User(u["email"], u["name"], u["role"]) for u in _load_users().values()]


def authenticate(email: str, password: str) -> User | None:
    record = _load_users().get(email.lower())
    if record is None:
        # Hash anyway so a missing account and a wrong password take the same
        # time, and the response cannot be used to enumerate addresses.
        _hasher.hash(password)
        return None
    try:
        _hasher.verify(record["hash"], password)
    except (VerifyMismatchError, VerificationError):
        return None

    if _hasher.check_needs_rehash(record["hash"]):
        create_user(record["email"], password, record["name"], record["role"])

    return User(record["email"], record["name"], record["role"])


# --------------------------------------------------------------------- session


def issue_cookie(response: Response, user: User) -> None:
    expires = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_ttl_hours)
    token = jwt.encode(
        {"sub": user.email, "name": user.name, "role": user.role, "exp": expires},
        settings.jwt_secret,
        algorithm=ALGORITHM,
    )
    response.set_cookie(
        COOKIE_NAME,
        token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="strict",
        max_age=settings.jwt_ttl_hours * 3600,
        path="/",
    )


def clear_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/")


def current_user(iv_session: str | None = Cookie(default=None)) -> User:
    if not iv_session:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not signed in")
    try:
        claims = jwt.decode(iv_session, settings.jwt_secret, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired")
    return User(claims["sub"], claims.get("name", ""), claims.get("role", "editor"))


def require_role(*allowed: str):
    """Route dependency: admin implicitly satisfies every editor-level route."""

    def dependency(user: User = Depends(current_user)) -> User:
        if user.role != "admin" and user.role not in allowed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
        return user

    return dependency
