"""
The admin API.

Note what is *not* here: no route serves the public site's content. Each save
regenerates dist/content.json and nginx serves that file directly, so the read
path never touches Python — the site stays fast and keeps working with this
container stopped.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .config import settings
from .db import init_db
from .routers import auth, content, media, submissions
from .store import rebuild_dist, repo

log = logging.getLogger("iv.api")


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.jwt_secret == "change-me":
        if settings.cookie_secure:
            # cookie_secure is only on in production, so this is a real deploy
            # with the sample secret. Refuse rather than issue forgeable
            # sessions that would look perfectly fine.
            raise RuntimeError(
                "IV_JWT_SECRET is still the default. Set it before deploying."
            )
        log.warning("IV_JWT_SECRET is the default value — development only.")

    repo.ensure_initialised()
    init_db()
    # Covers the case where the volume has pages but no dist yet, e.g. after a
    # restore from backup.
    rebuild_dist()
    yield


app = FastAPI(title="IV content API", lifespan=lifespan, docs_url=None, redoc_url=None)

app.include_router(auth.router)
app.include_router(content.router)
app.include_router(media.router)
app.include_router(submissions.router)


@app.get("/api/health")
def health() -> JSONResponse:
    return JSONResponse({"ok": True})
