# Compound Growth Studio

Marketing site for [compoundgrowthstudio.com](https://compoundgrowthstudio.com) — Astro static site with Sanity CMS, posting form submissions to the CRM.

The original self-contained HTML export lives in [`/site/`](./site/). Editable marketing copy is moving into **Sanity**; layout/code stays in this repo (Cursor/GitHub).

## Stack

- **Astro** (static output)
- **Sanity** (CMS for Conor + team — Studio in `/studio`)
- **CRM** at [crm.compoundgrowthstudio.com](https://crm.compoundgrowthstudio.com) (lead + contact intake)
- **Railway** (Docker + nginx)

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services/` | Services |
| `/system/` | Growth System |
| `/glp-1-peptide-marketing/` | Who We Serve (GLP-1 / weight loss / med spa) |
| `/pricing/` | Get Started (+ newsletter) |
| `/leadership/` | Leadership |
| `/faq/` | FAQ |
| `/contact/` | Contact / growth call |
| `/ai-voice-agent/` | AI voice agent demo |

## Local development

```bash
npm install
cp .env.example .env
# fill SUPABASE_* and (optionally) SANITY_AUTH_TOKEN for seeding
npm run dev
```

Open the URL Astro prints (usually `http://localhost:4321`).

```bash
npm run build    # output in dist/
npm run preview  # preview production build
```

### Sanity Studio (for Conor)

Project: **CGS Marketing Website** (`4rag8303`)

```bash
cd studio
npm install
npm run dev          # local Studio at http://localhost:3333
# or, after deploy:
# https://www.sanity.io/manage/project/4rag8303 → Studios
```

Invite Conor: [Project members](https://www.sanity.io/manage/project/4rag8303/members) → add `conor@…` as **Editor**.

Seed / refresh content from the current site copy (needs an **Editor** or **Admin** API token):

```bash
# in repo root .env:
# SANITY_AUTH_TOKEN=sk...
npm run sanity:seed
```

FAQ is wired to Sanity already (falls back to static HTML until content is seeded). Other pages keep static markup while schemas are ready in Studio.

### Regenerating page partials from `/site/`

If you update the bundled HTML in `/site/`:

```bash
python3 scripts/convert-site.py
```

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `FORM_ENDPOINT` | Yes | Where form submissions are POSTed (Google Apps Script web app, CRM route, etc.) |

At build time this is exposed as `PUBLIC_FORM_ENDPOINT` for the client form script. The older `CRM_LEADS_ENDPOINT` name is still accepted.

## Forms

Every form — contact, footer guide download, pricing newsletter, and the calculator email capture — POSTs the same JSON payload to `FORM_ENDPOINT`. The site is static, so nothing it holds is private; sending to one collector URL keeps database credentials out of the browser and makes swapping destinations a config change rather than a code change.

- **Simplest setup — Google Sheet:** [`docs/google-sheet-setup.md`](./docs/google-sheet-setup.md). Each submission becomes a row. No database or login.
- **CRM intake route:** [`docs/crm-lead-intake.md`](./docs/crm-lead-intake.md) for the payload shape and a reference implementation.

The request is sent as `text/plain` so browsers skip the CORS preflight, which Google Apps Script cannot answer. Receivers parse the body as JSON either way.

Forms include a hidden `website` honeypot and client-side email validation. A failed request shows an inline error rather than a false success, so submissions are never silently dropped.

## Deploy on Railway

1. Create a new Railway project from this GitHub repo.
2. Add the variable `FORM_ENDPOINT`.
3. Railway detects the `Dockerfile` (see `railway.toml`).
4. Set the public domain (or attach `compoundgrowthstudio.com`).
5. Redeploy after env changes so the value is baked into the static bundle.

Build args / env must be present **at image build time** — the endpoint is inlined into the client JS during `astro build`.

### Alternative: static-only host

`npm run build` produces `dist/`. You can serve that folder on any static host (Cloudflare Pages, Netlify, S3+CDN). Prefer hosts that support build-time env injection.

## Project layout

```
site/                     Original bundled HTML (source of truth)
src/
  layouts/BaseLayout.astro
  components/{Header,Footer}.astro
  content/partials/       Expanded page HTML from /site/
  pages/                  One route per page
  lib/leads.ts            Lead payload shape + attribution capture
  scripts/site.ts         Forms, counters, AI demo height listener
  styles/                 Design tokens + hover/focus rules
docs/google-sheet-setup.md  Send submissions to a Google Sheet
docs/crm-lead-intake.md   Contract for the CRM lead endpoint
scripts/convert-site.py   /site/ → partials converter
Dockerfile + nginx.conf   Railway static serve
```

## AI voice demo

`/ai-voice-agent/` embeds:

`https://midwest-exteriors-production.up.railway.app/receptionist/wellness?embed=1`

with `allow="microphone; autoplay"`, `scrolling="no"`, and a `postMessage` listener for `ai-demo:height` events from that origin.
