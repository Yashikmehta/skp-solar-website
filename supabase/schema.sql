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
