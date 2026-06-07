-- ============================================================
-- Verdex Dashboard — module Cybersécurité
-- Table `audit_reports` : rapports d'audit générés (scores + vulnérabilités),
-- protégée par RLS (lecture + insertion pour les utilisateurs authentifiés).
-- ============================================================

create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  client_id text not null default 'me',
  repo text,
  scores jsonb not null default '[]'::jsonb,
  vulnerabilities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_reports_client_created_idx
  on public.audit_reports (client_id, created_at desc);

alter table public.audit_reports enable row level security;

drop policy if exists "audit_reports_read_authenticated" on public.audit_reports;
create policy "audit_reports_read_authenticated"
  on public.audit_reports for select to authenticated using (true);

drop policy if exists "audit_reports_insert_authenticated" on public.audit_reports;
create policy "audit_reports_insert_authenticated"
  on public.audit_reports for insert to authenticated with check (true);
