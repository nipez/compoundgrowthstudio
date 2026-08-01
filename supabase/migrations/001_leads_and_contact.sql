-- Compound Growth Studio — form storage
-- Run in the Supabase SQL editor (or via supabase db push).

create extension if not exists pgcrypto;

-- Lead magnet + newsletter signups
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source_page text,
  tag text not null check (tag in ('lead_magnet', 'newsletter')),
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_tag_idx on public.leads (tag);

-- Contact / growth-call requests
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  clinic text,
  message text,
  newsletter boolean not null default false,
  source_page text,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- RLS: anon can insert only; no select/update/delete for anon
alter table public.leads enable row level security;
alter table public.contact_submissions enable row level security;

drop policy if exists "anon_insert_leads" on public.leads;
create policy "anon_insert_leads"
  on public.leads
  for insert
  to anon
  with check (true);

drop policy if exists "anon_insert_contact_submissions" on public.contact_submissions;
create policy "anon_insert_contact_submissions"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- Optional: authenticated users (dashboard) can read
drop policy if exists "authenticated_select_leads" on public.leads;
create policy "authenticated_select_leads"
  on public.leads
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated_select_contact_submissions" on public.contact_submissions;
create policy "authenticated_select_contact_submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (true);
