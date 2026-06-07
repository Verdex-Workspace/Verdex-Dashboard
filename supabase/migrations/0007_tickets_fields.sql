-- ============================================================
-- Verdex Dashboard — module Ticketing
-- Champs « GitHub Projects » complémentaires sur `tickets` :
-- milestone (jalon), size (taille) et estimate (estimation chiffrée).
-- ============================================================

alter table public.tickets
  add column if not exists milestone text,
  add column if not exists size text check (size in ('XS', 'S', 'M', 'L', 'XL')),
  add column if not exists estimate integer;
