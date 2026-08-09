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
