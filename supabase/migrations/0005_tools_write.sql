-- ============================================================
-- Suivi de dépôts : écriture autorisée aux utilisateurs authentifiés.
-- Purge des outils de démonstration (on ne garde que les dépôts réels).
-- ============================================================

drop policy if exists "tools_insert_authenticated" on public.tools;
create policy "tools_insert_authenticated"
  on public.tools for insert
  to authenticated
  with check (true);

drop policy if exists "tools_update_authenticated" on public.tools;
create policy "tools_update_authenticated"
  on public.tools for update
  to authenticated
  using (true);

drop policy if exists "tools_delete_authenticated" on public.tools;
create policy "tools_delete_authenticated"
  on public.tools for delete
  to authenticated
  using (true);

-- Purge des outils fictifs semés en 0003 (le vrai dépôt `dashboard` est conservé).
delete from public.tools where id in ('novaweb', 'atelier', 'billing', 'scraper', 'auth');
