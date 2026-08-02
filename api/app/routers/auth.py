"""Sign in, sign out, and who-am-I."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status

from ..auth import User, authenticate, clear_cookie, current_user, issue_cookie
from ..models import LoginRequest

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
def login(body: LoginRequest, response: Response) -> dict:
    user = authenticate(body.email, body.password)
    if user is None:
        # One message for both "no such account" and "wrong password", so the
        # response cannot be used to discover which addresses exist.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")

    issue_cookie(response, user)
    return {"email": user.email, "name": user.name, "role": user.role}


@router.post("/logout")
def logout(response: Response) -> dict:
    clear_cookie(response)
    return {"ok": True}


@router.get("/me")
def me(user: User = Depends(current_user)) -> dict:
    return {"email": user.email, "name": user.name, "role": user.role}
