-- Run once in Supabase → SQL Editor → New query → Run
-- Stores contact form and calculator report leads from POST /api/leads

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  mobile text not null,
  email text not null,
  city text not null,
  sector text not null,
  message text,
  source text not null check (source in ('Contact Page', 'Calculator Page')),
  estimate jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- No public policies: only the server (service role key) inserts via /api/leads
