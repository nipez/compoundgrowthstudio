-- Compound Growth Studio — client portal foundation
-- Run after 001_leads_and_contact.sql

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  portal_role text not null default 'client'
    check (portal_role in ('client', 'cgs_staff')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_portal_role_idx on public.profiles (portal_role);

-- ---------------------------------------------------------------------------
-- Organizations (clinics)
-- ---------------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  clinic_type text,
  website text,
  timezone text default 'America/Chicago',
  stripe_customer_id text unique,
  status text not null default 'onboarding'
    check (status in ('lead', 'onboarding', 'active', 'paused', 'churned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizations_status_idx on public.organizations (status);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  member_role text not null default 'member'
    check (member_role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_members_user_idx
  on public.organization_members (user_id);

-- ---------------------------------------------------------------------------
-- Engagements (projects / retainers)
-- ---------------------------------------------------------------------------
create table if not exists public.engagements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  plan_type text not null
    check (plan_type in (
      'community',
      'conversion_foundation',
      'full_growth_system',
      'ad_account_recovery',
      'custom'
    )),
  status text not null default 'intake'
    check (status in (
      'intake',
      'onboarding',
      'active',
      'paused',
      'completed',
      'cancelled'
    )),
  stripe_subscription_id text unique,
  stripe_price_id text,
  mrr_cents integer,
  started_at date,
  ended_at date,
  primary_strategist_id uuid references public.profiles (id),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists engagements_org_idx on public.engagements (organization_id);
create index if not exists engagements_status_idx on public.engagements (status);

-- ---------------------------------------------------------------------------
-- Onboarding / intake
-- ---------------------------------------------------------------------------
create table if not exists public.intake_forms (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements (id) on delete cascade,
  schema_version integer not null default 1,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'in_review', 'approved')),
  responses jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (engagement_id)
);

create table if not exists public.onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements (id) on delete cascade,
  title text not null,
  description text,
  owner_side text not null default 'client'
    check (owner_side in ('client', 'cgs')),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'blocked', 'done')),
  sort_order integer not null default 0,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists onboarding_tasks_engagement_idx
  on public.onboarding_tasks (engagement_id);

-- ---------------------------------------------------------------------------
-- Communications
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  engagement_id uuid references public.engagements (id) on delete set null,
  subject text not null,
  status text not null default 'open'
    check (status in ('open', 'resolved', 'archived')),
  created_by uuid references public.profiles (id),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  author_id uuid references public.profiles (id),
  body text not null,
  is_internal boolean not null default false, -- CGS-only notes
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages (conversation_id);

-- ---------------------------------------------------------------------------
-- Documents, deliverables, approvals
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  engagement_id uuid references public.engagements (id) on delete set null,
  title text not null,
  category text not null default 'other'
    check (category in (
      'contract',
      'brand',
      'compliance',
      'creative',
      'report',
      'other'
    )),
  storage_path text,
  external_url text,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements (id) on delete cascade,
  title text not null,
  kind text not null default 'report'
    check (kind in ('report', 'landing_page', 'creative', 'campaign', 'other')),
  status text not null default 'draft'
    check (status in ('draft', 'shared', 'archived')),
  summary text,
  external_url text,
  period_start date,
  period_end date,
  shared_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements (id) on delete cascade,
  title text not null,
  kind text not null default 'other'
    check (kind in ('landing_page', 'ad_creative', 'copy', 'brand', 'other')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'changes_requested', 'cancelled')),
  preview_url text,
  notes text,
  requested_by uuid references public.profiles (id),
  decided_by uuid references public.profiles (id),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Billing cache (Stripe is source of truth)
-- ---------------------------------------------------------------------------
create table if not exists public.billing_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stripe_invoice_id text not null unique,
  number text,
  status text not null,
  amount_due_cents integer not null default 0,
  amount_paid_cents integer not null default 0,
  currency text not null default 'usd',
  hosted_invoice_url text,
  invoice_pdf text,
  period_start timestamptz,
  period_end timestamptz,
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists billing_invoices_org_idx
  on public.billing_invoices (organization_id);

-- ---------------------------------------------------------------------------
-- Activity + notifications
-- ---------------------------------------------------------------------------
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  engagement_id uuid references public.engagements (id) on delete set null,
  actor_id uuid references public.profiles (id),
  event_type text not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_org_idx
  on public.activity_events (organization_id, created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_cgs_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.portal_role = 'cgs_staff'
  );
$$;

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, portal_role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'portal_role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.engagements enable row level security;
alter table public.intake_forms enable row level security;
alter table public.onboarding_tasks enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.documents enable row level security;
alter table public.deliverables enable row level security;
alter table public.approvals enable row level security;
alter table public.billing_invoices enable row level security;
alter table public.activity_events enable row level security;
alter table public.notifications enable row level security;

-- Profiles
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_cgs_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Organizations
drop policy if exists "orgs_select_member_or_staff" on public.organizations;
create policy "orgs_select_member_or_staff" on public.organizations
  for select to authenticated
  using (public.is_org_member(id) or public.is_cgs_staff());

drop policy if exists "orgs_update_staff" on public.organizations;
create policy "orgs_update_staff" on public.organizations
  for all to authenticated
  using (public.is_cgs_staff())
  with check (public.is_cgs_staff());

-- Members
drop policy if exists "members_select_member_or_staff" on public.organization_members;
create policy "members_select_member_or_staff" on public.organization_members
  for select to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "members_write_staff" on public.organization_members;
create policy "members_write_staff" on public.organization_members
  for all to authenticated
  using (public.is_cgs_staff())
  with check (public.is_cgs_staff());

-- Engagements + child tables: org member or staff
drop policy if exists "engagements_select" on public.engagements;
create policy "engagements_select" on public.engagements
  for select to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "engagements_write_staff" on public.engagements;
create policy "engagements_write_staff" on public.engagements
  for all to authenticated
  using (public.is_cgs_staff())
  with check (public.is_cgs_staff());

drop policy if exists "intake_select" on public.intake_forms;
create policy "intake_select" on public.intake_forms
  for select to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "intake_upsert_member" on public.intake_forms;
create policy "intake_upsert_member" on public.intake_forms
  for all to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  )
  with check (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "tasks_select" on public.onboarding_tasks;
create policy "tasks_select" on public.onboarding_tasks
  for select to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "tasks_write" on public.onboarding_tasks;
create policy "tasks_write" on public.onboarding_tasks
  for all to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  )
  with check (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select" on public.conversations
  for select to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "conversations_write" on public.conversations;
create policy "conversations_write" on public.conversations
  for all to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff())
  with check (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (public.is_org_member(c.organization_id) or public.is_cgs_staff())
        and (is_internal = false or public.is_cgs_staff())
    )
  );

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert to authenticated
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (public.is_org_member(c.organization_id) or public.is_cgs_staff())
        and (is_internal = false or public.is_cgs_staff())
    )
  );

drop policy if exists "documents_select" on public.documents;
create policy "documents_select" on public.documents
  for select to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "documents_write_staff" on public.documents;
create policy "documents_write_staff" on public.documents
  for all to authenticated
  using (public.is_cgs_staff())
  with check (public.is_cgs_staff());

drop policy if exists "deliverables_select" on public.deliverables;
create policy "deliverables_select" on public.deliverables
  for select to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "deliverables_write_staff" on public.deliverables;
create policy "deliverables_write_staff" on public.deliverables
  for all to authenticated
  using (public.is_cgs_staff())
  with check (public.is_cgs_staff());

drop policy if exists "approvals_select" on public.approvals;
create policy "approvals_select" on public.approvals
  for select to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "approvals_write" on public.approvals;
create policy "approvals_write" on public.approvals
  for all to authenticated
  using (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  )
  with check (
    public.is_cgs_staff()
    or exists (
      select 1 from public.engagements e
      where e.id = engagement_id and public.is_org_member(e.organization_id)
    )
  );

drop policy if exists "invoices_select" on public.billing_invoices;
create policy "invoices_select" on public.billing_invoices
  for select to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "invoices_write_staff" on public.billing_invoices;
create policy "invoices_write_staff" on public.billing_invoices
  for all to authenticated
  using (public.is_cgs_staff())
  with check (public.is_cgs_staff());

drop policy if exists "activity_select" on public.activity_events;
create policy "activity_select" on public.activity_events
  for select to authenticated
  using (public.is_org_member(organization_id) or public.is_cgs_staff());

drop policy if exists "activity_write_staff" on public.activity_events;
create policy "activity_write_staff" on public.activity_events
  for insert to authenticated
  with check (public.is_cgs_staff() or public.is_org_member(organization_id));

drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
