-- ============================================================
-- Lien vers le dépôt GitHub d'un outil (active les données réelles
-- via la fonction serverless /api/github).
-- ============================================================

alter table public.tools add column if not exists repo text;

-- Le dashboard lui-même pointe sur son dépôt public.
update public.tools
set repo = 'Verdex-Workspace/Verdex-Dashboard'
where id = 'dashboard';
