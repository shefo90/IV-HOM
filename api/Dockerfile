# The admin API. Build from the repository root, not from api/ — the seed
# content and images live in the frontend tree:
#   docker build -f api/Dockerfile .

FROM python:3.12-slim

# git is the content datastore, so the binary has to be in the image.
RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY api/app ./app

# Baked in so `python -m app.cli seed` works against an empty volume without
# needing the frontend source at runtime.
COPY src/content/fallback.json ./seed/fallback.json
COPY public/media ./seed/media

# The volume is usually owned by a different uid than the container user, and
# git refuses to operate in a directory it considers foreign.
RUN git config --global --add safe.directory /data/content \
 && git config --global user.name  "IV CMS" \
 && git config --global user.email "cms@ivfixed.com"

EXPOSE 8000

# One worker on purpose: the content writes are guarded by a file lock and
# SQLite is single-writer. Scaling this needs a different locking story.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
