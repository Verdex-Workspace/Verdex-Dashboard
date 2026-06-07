-- ============================================================
-- Verdex Dashboard — module Ticketing
-- Table `tickets` (modèle relationnel riche) protégée par RLS
-- (lecture + écriture pour les utilisateurs authentifiés).
-- ============================================================

create sequence if not exists public.tickets_ref_seq start 100;

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  ref integer not null default nextval('public.tickets_ref_seq'),
  title text not null,
  description text not null default '',
  type text not null check (type in ('bug', 'feature', 'perf', 'chore')),
  priority text not null check (priority in ('P1', 'P2', 'P3')),
  status text not null check (status in ('backlog', 'todo', 'in_progress', 'review', 'done')),
  effort integer not null default 0,
  impact integer not null default 0,
  tool_id text,
  client_id text not null default 'me',
  assignee_id text,
  labels jsonb not null default '[]'::jsonb,
  deadline date,
  sprint text,
  linked_prs jsonb not null default '[]'::jsonb,
  linked_issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tickets enable row level security;

drop policy if exists "tickets_read_authenticated" on public.tickets;
create policy "tickets_read_authenticated"
  on public.tickets for select to authenticated using (true);

drop policy if exists "tickets_insert_authenticated" on public.tickets;
create policy "tickets_insert_authenticated"
  on public.tickets for insert to authenticated with check (true);

drop policy if exists "tickets_update_authenticated" on public.tickets;
create policy "tickets_update_authenticated"
  on public.tickets for update to authenticated using (true);

drop policy if exists "tickets_delete_authenticated" on public.tickets;
create policy "tickets_delete_authenticated"
  on public.tickets for delete to authenticated using (true);
