-- Compound Growth Studio — calculator captures + lead context columns
-- Run after 001_leads_and_contact.sql.

-- The calculator form submits tag = 'calculator'; widen the check constraint.
alter table public.leads drop constraint if exists leads_tag_check;
alter table public.leads
  add constraint leads_tag_check
  check (tag in ('lead_magnet', 'newsletter', 'calculator'));

-- Optional context the calculator + future forms send alongside the email.
alter table public.leads add column if not exists clinic text;
alter table public.leads add column if not exists city text;
alter table public.leads add column if not exists notes text;
