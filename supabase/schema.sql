-- ============================================================================
-- SKP SOLAR WORLD — LEAD STORAGE
-- ============================================================================
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It creates the permanent lead table used by POST /api/leads.
--
-- Both the Contact enquiry form and the Solar Calculator write here. The
-- calculator additionally fills `estimate` with the inputs and every figure the
-- on-screen report showed the customer.
-- ============================================================================

create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),

  name        text not null,
  company     text,
  mobile      text not null,
  email       text not null,
  city        text not null,
  sector      text not null,
  message     text,

  -- 'Contact Page' | 'Calculator Page'
  source      text not null,

  -- Solar Calculator context; null for Contact-page leads.
  -- Keys: monthlyBill, systemKw, monthlyGeneration, monthlySavings,
  --       annualSavings, savings25, systemCost, paybackYears, co2Tonnes,
  --       trees, billOffset
  estimate    jsonb
);

-- Newest leads first, which is how you will always read this table.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx     on public.leads (source);

-- ----------------------------------------------------------------------------
-- Table privileges
-- ----------------------------------------------------------------------------
-- RLS decides WHICH ROWS a role may touch, but Postgres GRANTs decide whether
-- the role may touch the table at all. Newer Supabase projects do not always
-- apply default privileges to newly created tables, which surfaces as
-- "permission denied for table leads" even with a correct RLS policy.
--
-- The website (anon) may only INSERT. Only service_role may read.
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant insert on table public.leads to anon, authenticated;
grant select, insert on table public.leads to service_role;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
-- The website authenticates with the ANON key, so RLS must explicitly allow the
-- insert. Inserts are permitted; reads are NOT — the anon key cannot list or
-- export leads even though it is a public-facing credential.
--
-- Read your leads in the Supabase Dashboard (Table Editor), or from a trusted
-- server using the service-role key.
-- ----------------------------------------------------------------------------
alter table public.leads enable row level security;

drop policy if exists "website can insert leads" on public.leads;
create policy "website can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Deliberately no SELECT / UPDATE / DELETE policy for anon.


-- ============================================================================
-- ADMIN CREDENTIALS
-- ============================================================================
-- Lets the admin change the panel password from Settings instead of editing a
-- Vercel environment variable and redeploying.
--
-- Only ever holds a PBKDF2-SHA256 hash — never the password itself. Until a
-- password is set here, login falls back to the ADMIN_PASSWORD environment
-- variable, so nothing breaks on the first deploy.
--
-- The `id = 1` check keeps this to exactly one row: there is one shared admin
-- password, and a second row would be ambiguous.
-- ============================================================================
create table if not exists public.admin_settings (
  id            smallint primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at    timestamptz not null default now()
);

-- Locked to service_role. anon and authenticated get nothing at all: the
-- public-facing key must never be able to read or overwrite the admin hash.
revoke all on table public.admin_settings from anon, authenticated;
grant select, insert, update, delete on table public.admin_settings to service_role;

-- LOCKED OUT? Delete the row and login falls back to the ADMIN_PASSWORD
-- environment variable again:
--     delete from public.admin_settings where id = 1;

alter table public.admin_settings enable row level security;
-- No policies. service_role bypasses RLS; every other role is denied.
