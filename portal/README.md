# CGS Client Portal

Client-facing and CGS operations portal for Compound Growth Studio.

Runs as a **separate Astro SSR app** so the marketing site can stay static. Intended deploy host: `app.compoundgrowthstudio.com` (or Railway service sibling).

## Product surface

### Dual access

| Portal | Who | Purpose |
| --- | --- | --- |
| **Client** | Clinic owners / marketing leads | Self-serve project status, intake, billing, approvals, messages |
| **CGS Ops** | Conor, Nick, strategists | Manage clients, engagements, intake review, billing oversight, messaging |

Roles live in Supabase (`profiles.portal_role`: `client` \| `cgs_staff`). Staff can impersonate read-only client views later; not in v1.

### Modules (v1 foundation)

1. **Auth** — email magic-link / password via Supabase Auth; route guards by role
2. **Organizations** — one clinic = one org; multi-user membership
3. **Engagements** — Community / Conversion Foundation / Full Growth System / Ad Recovery
4. **Onboarding & intake** — checklist + structured clinic intake questionnaire + asset requests
5. **Billing & payments** — Stripe Billing (Checkout + Customer Portal); invoice history in-app
6. **Communications** — threaded messages between clinic and CGS (email notify later)
7. **Deliverables & reports** — monthly reports, creative links, campaign summaries
8. **Approvals** — landing pages, ad creative, copy sign-off with audit trail
9. **Documents** — contracts, brand kits, compliance packs (Supabase Storage)
10. **Activity feed** — “what happened” across the engagement

### Recommended next modules

- **Performance dashboard** — Meta/Google metrics snapshot (read-only embeds or synced KPIs)
- **Task board** — shared work queue (CGS assigns; client completes assets/approvals)
- **Meeting scheduler** — book strategy / gap calls (Cal.com or similar)
- **Nurture / CRM handoff** — surface lead volume from landing pages (privacy-safe aggregates)
- **Notifications center** — in-app + email digests for approvals due / invoices / messages
- **Team & permissions** — clinic seats; CGS internal roles (admin / ops / strategist)
- **AI voice / lead magnet status** — product-specific health for add-on services
- **Contract / MSA e-sign** — DocuSign or similar before kickoff

## Stack

- Astro 7 SSR (`@astrojs/node`)
- Supabase Auth + Postgres + Storage + RLS
- Stripe Billing (Checkout Sessions `mode: 'subscription'` + Customer Portal)
- Shared CGS brand tokens (navy / blue / Plus Jakarta + Archivo)

## Local development

```bash
cd portal
cp .env.example .env
# fill PUBLIC_SUPABASE_*, SUPABASE_SERVICE_ROLE_KEY (server), STRIPE_* when ready
npm install
npm run dev
```

Demo mode (no Supabase required): open `/login/` and use **Continue as demo client** or **Continue as CGS**.

## Deploy on Railway (demo preview)

Keep the existing marketing Railway service on the repo root `Dockerfile`. Add a **second service** for the portal:

1. Railway → project → **New Service** → Deploy from GitHub (same repo).
2. Settings → **Root Directory** = `portal`
3. It picks up [`railway.toml`](./railway.toml) + [`Dockerfile`](./Dockerfile).
4. Variables (demo can ship with none; add when ready):

| Variable | Required for demo | Notes |
| --- | --- | --- |
| `PUBLIC_PORTAL_URL` | Recommended | Set to the Railway public URL after first deploy, e.g. `https://cgs-portal-production.up.railway.app` |
| `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` | No | Enables real magic-link auth |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server-side webhook sync later |
| `STRIPE_*` | No | Billing live later |

5. Generate domain → open `/login/` → demo client / CGS ops.
6. Later: attach custom domain `app.compoundgrowthstudio.com` and set `PUBLIC_PORTAL_URL` to match.

Healthcheck path: `/login/`.

## Database

Run from repo root in Supabase SQL editor (after `001_leads_and_contact.sql`):

- [`../supabase/migrations/002_portal_foundation.sql`](../supabase/migrations/002_portal_foundation.sql)

## Billing approach

Retainers map cleanly to **Stripe Billing**:

| CGS offer | Stripe model |
| --- | --- |
| Clinic Growth Community ($100/mo) | Product + recurring Price |
| Conversion Foundation ($1,000/mo) | Product + recurring Price |
| Full Growth System (custom) | Custom Price / invoice items |
| Ad Account Recovery (fixed) | One-time Checkout `mode: 'payment'` |

Self-serve payment method + cancel/upgrade via **Stripe Customer Portal**. Webhooks sync subscription status onto `engagements`.
