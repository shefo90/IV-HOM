# IV — fixed furniture

A React 19 + Vite marketing site with a self-hosted CMS and a form inbox.
No external services: everything runs on one VPS in two containers.

- **Client-facing guide:** [docs/editing-guide.md](docs/editing-guide.md)
- Originally scaffolded from AI Studio:
  https://ai.studio/apps/eac8de1a-5a96-4068-945b-15e203d948d2

## How it fits together

```
                    ┌─ /content.json ─ static file, regenerated on save
browser ── nginx ───┼─ /media/*      ─ straight off the content volume
                    ├─ /api/*        ─ proxy ─→ FastAPI
                    └─ /*            ─ the SPA (including /admin)
```

Two things follow from this shape and are worth knowing before changing it.

**The public read path never touches Python.** Every save regenerates
`dist/content.json`, which nginx serves as a static file. The site is as fast
as a static build and keeps serving with the API container stopped.

**Two datastores, deliberately.** Content is eight JSON documents in a git repo
on a volume — that is where version history, per-editor attribution, diffs and
one-click restore come from, with no schema to maintain. Submissions are an
append-heavy log of personal data with mutable status, so they live in SQLite
on a *separate* volume: the content repo gets pushed to a backup remote, and
customers' names and phone numbers must not travel with it.

## Running locally

Two terminals.

```bash
# 1. API — seeds a scratch content repo on first run
cd api
python -m venv .venv && ./.venv/Scripts/python -m pip install -r requirements-dev.txt
export IV_CONTENT_DIR=/tmp/iv/content IV_APP_DATA_DIR=/tmp/iv/app IV_AUTH_DIR=/tmp/iv/auth
export IV_JWT_SECRET=dev-secret IV_COOKIE_SECURE=false
./.venv/Scripts/python -m app.cli seed --content ../src/content/fallback.json --media ../public/media
./.venv/Scripts/python -m app.cli create-user you@example.com --name "You" --role admin
./.venv/Scripts/python -m uvicorn app.main:app --port 8000
```

```bash
# 2. Site — Vite proxies /api to :8000
npm install
npm run dev          # http://localhost:3000, admin at /admin
```

## Deploying

```bash
cp .env.example .env         # set IV_JWT_SECRET — `openssl rand -hex 32`
docker compose up -d --build
docker compose exec api python -m app.cli seed
docker compose exec api python -m app.cli create-user client@example.com --name "Client" --role editor
```

Put a TLS terminator (Caddy, or nginx + certbot) in front of `web`.

`IV_JWT_SECRET` has no default, and the API refuses to start without a real one
when cookies are secure — an unset secret would mean forgeable sessions that
otherwise look perfectly fine.

### Operating

Content edits never rebuild anything: the client saves, nginx serves the new
file, done. Rebuild only when *code* changes — `docker compose up -d --build`.

Schedule these:

```bash
docker compose exec api python -m app.cli backup   # push content off-site
docker compose exec api python -m app.cli purge    # drop Trash past retention
# plus a nightly copy of the submissions database, which the content
# backup deliberately does not include:
docker compose exec api sqlite3 /data/app/submissions.db ".backup /tmp/s.db"
```

**A backup you have never restored is not a backup.** Clone the content remote
into a scratch directory and restore the database copy at least once.

## Content model

`api/app/schema/site_schema.json` is the single source of truth: the FastAPI
validator and the admin's form renderer both read it, so the UI and the API
cannot disagree. It is **generated**, not hand-written:

```bash
node scripts/gen-schema.cjs      # derives it from src/content/fallback.json
```

Lists have `min` equal to `max`, locking each grid to the count it was designed
for. Widening one is a single value change in the generator.

`src/content/fallback.json` is the copy baked into the bundle. It is the seed
data, the fixture the visual tests run against, and the fallback the site
renders if `/content.json` cannot be fetched — so a blank page is impossible.

### Headings

Headings store a small markdown subset rendered by
[`src/components/RichText.tsx`](src/components/RichText.tsx): `*italic*`,
`**gold**`, `***gold italic***`, and a trailing period that becomes the
oversized gold dot. Write `\.` for an ordinary period — the design is not
consistent about this (`Three signatures.` golds its mid-heading period,
`Seven disciplines.` does not), so it cannot be derived. The admin has buttons
for all of it, so the client never types a marker.

## Testing

```bash
npm run lint                                   # tsc --noEmit
npx playwright test                            # 33 visual + behaviour tests
cd api && ./.venv/Scripts/python -m pytest     # 27 API tests
```

The visual suite pixel-diffs every converted route against the original
standalone HTML in `public/pages/` at three viewports, 0.1% tolerance. It runs
with no `/content.json` present, so one run proves both that the content
extraction preserved every string *and* that the outage fallback works.

**These tests expire.** They assert the pages match frozen HTML, so the
client's first real edit makes them fail by design. Re-baseline them as
screenshots of the React pages before go-live.

## Known follow-ups

- **Re-baseline the visual tests** (above), then move
  `public/pages/IV-*-standalone.html` out of `public/`. They are publicly
  reachable duplicates of every page and an SEO liability.
- **Four dead components.** `TechSection`, `DisciplinesSection`,
  `LetBuildSection` and `TeamSection` are imported by nothing — left over from
  the HTML→React conversion. They are the only remaining consumers of
  `src/data.ts`; deleting them retires that file too.
- **`ProposalModal` shows visitors a fabricated price.** `calculateEstimate()`
  multiplies square metres by a hardcoded rate and presents the result as
  "Est. range: $X USD". The code comment says it exists "just for dynamic
  interaction" — but it is a number customers may hold you to.
- **The tour form's default time slot, `11:00`, is not one of its four
  options**, so that select opens with nothing chosen. Pre-existing; preserved
  rather than silently changed.
- SMTP alerts on new submissions, if the unread badge proves insufficient.
- Cloudflare Turnstile, if the honeypot and rate limits stop being enough.
