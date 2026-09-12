-- Ticket 01: Auth & account-scoped persistence
-- Base schema for a signer's data (reviews, red lines), every row scoped
-- to the authenticated signer via Row Level Security.
--
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste
-- this whole file -> Run. Safe to re-run (uses IF NOT EXISTS / OR REPLACE).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.red_lines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
alter table public.red_lines enable row level security;

drop policy if exists "Signers see only their own reviews" on public.reviews;
create policy "Signers see only their own reviews"
  on public.reviews
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Signers see only their own red lines" on public.red_lines;
create policy "Signers see only their own red lines"
  on public.red_lines
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
