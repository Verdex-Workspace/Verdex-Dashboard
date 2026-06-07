-- ============================================================
-- Verdex Dashboard — module Cybersécurité (pipeline documentaire)
-- Documents ingérés + bucket de stockage privé + champs de synthèse sur les
-- rapports. Protégé par RLS (utilisateurs authentifiés).
-- ============================================================

-- 1. Table des documents ingérés (texte extrait conservé pour la synthèse).
create table if not exists public.audit_documents (
  id uuid primary key default gen_random_uuid(),
  client_id text not null default 'me',
  name text not null,
  path text,
  kind text,
  size integer,
  status text not null default 'ok' check (status in ('ok', 'warn')),
  content text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists audit_documents_client_idx
  on public.audit_documents (client_id, created_at);

alter table public.audit_documents enable row level security;

drop policy if exists "audit_documents_read_authenticated" on public.audit_documents;
create policy "audit_documents_read_authenticated"
  on public.audit_documents for select to authenticated using (true);

drop policy if exists "audit_documents_insert_authenticated" on public.audit_documents;
create policy "audit_documents_insert_authenticated"
  on public.audit_documents for insert to authenticated with check (true);

drop policy if exists "audit_documents_delete_authenticated" on public.audit_documents;
create policy "audit_documents_delete_authenticated"
  on public.audit_documents for delete to authenticated using (true);

-- 2. Bucket de stockage privé pour les fichiers d'origine.
insert into storage.buckets (id, name, public)
values ('audit-docs', 'audit-docs', false)
on conflict (id) do nothing;

drop policy if exists "audit_docs_rw_authenticated" on storage.objects;
create policy "audit_docs_rw_authenticated"
  on storage.objects for all to authenticated
  using (bucket_id = 'audit-docs')
  with check (bucket_id = 'audit-docs');

-- 3. Champs de synthèse / sources sur les rapports d'audit.
alter table public.audit_reports
  add column if not exists synthesis text,
  add column if not exists documents jsonb not null default '[]'::jsonb;
