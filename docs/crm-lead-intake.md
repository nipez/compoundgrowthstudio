# CRM lead intake contract

Marketing forms on `compoundgrowthstudio.com` POST straight to the CRM. The
marketing site is a static build, so anything it holds is public — routing
through the CRM's server keeps database credentials out of the browser and
puts every submission in the CRM as the single source of truth.

Set `CRM_LEADS_ENDPOINT` in the marketing site's Railway variables (and
redeploy — the value is inlined at build time).

## Endpoint

```
POST https://crm.compoundgrowthstudio.com/api/leads
Content-Type: application/json
```

## Request body

```jsonc
{
  "kind": "contact",              // contact | guide | newsletter | calculator
  "email": "owner@clinic.com",    // always present, lowercased
  "name": "Jane Doe",             // contact only
  "clinic": "Northside Wellness",  // contact + calculator
  "city": "Austin",               // calculator
  "message": "Which program…",    // contact
  "newsletter": true,             // contact checkbox
  "calculator": "{\"activePatients\":100,…}", // JSON string of inputs + results
  "sourcePage": "/contact/?from=compliance-teardown",
  "sourceUrl": "https://compoundgrowthstudio.com/contact/?from=compliance-teardown",
  "referrer": "https://www.google.com/",
  "utm": { "from": "compliance-teardown", "utm_source": "meta" },
  "submittedAt": "2026-08-09T01:20:00.000Z"
}
```

Only `kind`, `email`, `sourcePage`, `sourceUrl`, and `submittedAt` are
guaranteed. Everything else is omitted when the form does not collect it.

### Where each `kind` comes from

| `kind` | Form |
| --- | --- |
| `contact` | `/contact/` growth call request |
| `guide` | Footer "Get the Guide" (Meta ads guide) |
| `newsletter` | `/pricing/` newsletter signup |
| `calculator` | `/calculator/` email capture, includes the computed leak figures |

## Response

- **2xx** — accepted. The form shows its success state; guide and calculator
  submissions then redirect.
- **Any non-2xx or network error** — the form shows an inline error and the
  visitor can retry. Nothing is silently dropped.

Body content is ignored, so a bare `{ "ok": true }` is fine.

## What the CRM route needs to handle

- **CORS.** Respond to `OPTIONS` and send
  `Access-Control-Allow-Origin: https://compoundgrowthstudio.com`
  (add the Railway preview domain if you test there) plus
  `Access-Control-Allow-Headers: Content-Type`. Without this the browser
  blocks the POST.
- **Rate limiting.** The route is public and unauthenticated. Cap by IP.
- **Validation.** Re-check the email server-side; the client check is only a
  convenience.
- **Spam.** The forms include a hidden `website` honeypot field and drop those
  submissions before they are sent, so the CRM will not see them. Server-side
  filtering is still worthwhile.
- **Deduping.** The same email can legitimately submit more than once (guide,
  then contact). Treat `kind` + `email` + `submittedAt` as the identity.

Once the route is live, every submission — including the `?from=` intent
parameter that tells you which offer drove it — lands in the CRM.

## Reference implementation

The CRM is a Next.js app. Below is a working starting point — adapt naming to
match the CRM's existing conventions.

### 1. Exempt the route from auth middleware

**This is the step that is easy to miss.** Today `POST /api/leads` answers
`307 → /login?next=/api/leads`, because the CRM's middleware protects
everything by default. `GET /api/health` returns `200`, so an allowlist already
exists — add the leads route to it.

```ts
// middleware.ts
const PUBLIC_PATHS = ['/login', '/api/health', '/api/leads'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  // …existing auth redirect…
}
```

If the middleware instead uses a `config.matcher`, exclude `api/leads` there.

### 2. Store the submission

```sql
create extension if not exists pgcrypto;

create table if not exists public.website_leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'guide', 'newsletter', 'calculator')),
  email text not null,
  name text,
  clinic text,
  city text,
  message text,
  newsletter boolean not null default false,
  calculator jsonb,
  source_page text,
  source_url text,
  referrer text,
  utm jsonb,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists website_leads_created_at_idx on public.website_leads (created_at desc);
create index if not exists website_leads_email_idx on public.website_leads (email);

-- Writes happen server-side with the service role, so no anon policy is needed.
alter table public.website_leads enable row level security;
```

### 3. Route handler

```ts
// app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  'https://compoundgrowthstudio.com',
  'https://www.compoundgrowthstudio.com',
];

const KINDS = ['contact', 'guide', 'newsletter', 'calculator'] as const;

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: cors(request.headers.get('origin')) });
}

export async function POST(request: Request) {
  const headers = cors(request.headers.get('origin'));

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400, headers });
  }

  const kind = String(body.kind ?? '');
  const email = String(body.email ?? '').trim().toLowerCase();

  if (!KINDS.includes(kind as (typeof KINDS)[number])) {
    return NextResponse.json({ error: 'invalid kind' }, { status: 400, headers });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400, headers });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from('website_leads').insert({
    kind,
    email,
    name: body.name ?? null,
    clinic: body.clinic ?? null,
    city: body.city ?? null,
    message: body.message ?? null,
    newsletter: Boolean(body.newsletter),
    // The site sends this as a JSON string.
    calculator: body.calculator ? JSON.parse(String(body.calculator)) : null,
    source_page: body.sourcePage ?? null,
    source_url: body.sourceUrl ?? null,
    referrer: body.referrer ?? null,
    utm: body.utm ?? null,
    submitted_at: body.submittedAt ?? null,
  });

  if (error) {
    console.error('[crm] lead insert failed', error.message);
    return NextResponse.json({ error: 'insert failed' }, { status: 500, headers });
  }

  return NextResponse.json({ ok: true }, { status: 200, headers });
}
```

### 4. Verify

```bash
curl -i -X POST https://crm.compoundgrowthstudio.com/api/leads \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://compoundgrowthstudio.com' \
  -d '{"kind":"newsletter","email":"test@example.com","sourcePage":"/","sourceUrl":"https://compoundgrowthstudio.com/","submittedAt":"2026-01-01T00:00:00.000Z"}'
```

Expect `200` with `access-control-allow-origin` in the response headers. A
`307` means the middleware is still intercepting the route.
