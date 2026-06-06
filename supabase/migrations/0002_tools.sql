-- ============================================================
-- Verdex Dashboard — module Projets & Outils
-- Tables `tools` (cartes) et `tool_details` (panneau de détail, JSONB),
-- protégées par RLS (lecture pour les utilisateurs authentifiés).
-- ============================================================

create table if not exists public.tools (
  id text primary key,
  name text not null,
  env text not null check (env in ('prod', 'staging', 'dev')),
  status text not null check (status in ('ok', 'warn', 'err', 'info', 'neutral')),
  version text not null,
  stack text not null,
  icon text not null,
  open_prs integer not null default 0,
  open_issues integer not null default 0,
  client_id text not null default 'me',
  created_at timestamptz not null default now()
);

create table if not exists public.tool_details (
  tool_id text primary key references public.tools (id) on delete cascade,
  port integer,
  description text,
  metrics jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  commits jsonb not null default '[]'::jsonb,
  pull_requests jsonb not null default '[]'::jsonb,
  issues jsonb not null default '[]'::jsonb,
  deployments jsonb not null default '[]'::jsonb
);

alter table public.tools enable row level security;
alter table public.tool_details enable row level security;

-- Lecture autorisée à tout utilisateur authentifié.
drop policy if exists "tools_read_authenticated" on public.tools;
create policy "tools_read_authenticated"
  on public.tools for select
  to authenticated
  using (true);

drop policy if exists "tool_details_read_authenticated" on public.tool_details;
create policy "tool_details_read_authenticated"
  on public.tool_details for select
  to authenticated
  using (true);
