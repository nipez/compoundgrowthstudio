# Compound Growth Studio

Marketing site for [compoundgrowthstudio.com](https://compoundgrowthstudio.com) — Astro static site with Sanity CMS + Supabase-backed forms.

The original self-contained HTML export lives in [`/site/`](./site/). Editable marketing copy is moving into **Sanity**; layout/code stays in this repo (Cursor/GitHub).

## Stack

- **Astro** (static output)
- **Sanity** (CMS for Conor + team — Studio in `/studio`)
- **Supabase** (leads + contact submissions, insert-only RLS)
- **Railway** (Docker + nginx)

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services/` | Services |
| `/system/` | Growth System |
| `/glp-1-peptide-marketing/` | GLP-1 + Peptide Marketing |
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
| `SUPABASE_URL` | Yes | Project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Yes | Anon/public key — safe in the browser with RLS |

At build time these are also exposed as `PUBLIC_SUPABASE_*` for the client form script.

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/migrations/001_leads_and_contact.sql`](./supabase/migrations/001_leads_and_contact.sql) in the SQL editor.
3. Copy the project URL + anon key into `.env` / Railway.

### Tables

**`leads`** — lead magnet + newsletter

- `email`, `source_page`, `tag` (`lead_magnet` \| `newsletter`), `created_at`

**`contact_submissions`** — contact form

- `name`, `email`, `clinic`, `message`, `newsletter`, `source_page`, `created_at`

Both tables use **RLS with insert-only policies for `anon`**. Forms also include a honeypot field (`website`) and basic email validation.

## Deploy on Railway

1. Create a new Railway project from this GitHub repo.
2. Add variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
3. Railway detects the `Dockerfile` (see `railway.toml`).
4. Set the public domain (or attach `compoundgrowthstudio.com`).
5. Redeploy after env changes so keys are baked into the static bundle.

Build args / env must be present **at image build time** — the anon key is inlined into the client JS during `astro build`.

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
  scripts/site.ts         Forms, counters, AI demo height listener
  styles/                 Design tokens + hover/focus rules
supabase/migrations/      SQL for tables + RLS
scripts/convert-site.py   /site/ → partials converter
Dockerfile + nginx.conf   Railway static serve
```

## AI voice demo

`/ai-voice-agent/` embeds:

`https://midwest-exteriors-production.up.railway.app/receptionist/wellness?embed=1`

with `allow="microphone; autoplay"`, `scrolling="no"`, and a `postMessage` listener for `ai-demo:height` events from that origin.
