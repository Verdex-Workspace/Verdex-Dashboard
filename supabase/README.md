# Supabase — schéma & migrations

Les migrations SQL versionnées de la base Verdex vivent dans
[`migrations/`](./migrations). Elles sont la **source de vérité** du schéma :
ne modifiez pas la base à la main, ajoutez une migration.

## Appliquer les migrations

> Prérequis : [Supabase CLI](https://supabase.com/docs/guides/cli) installé.

```bash
supabase login                              # une fois
supabase link --project-ref <project-ref>   # lie le dépôt au projet
supabase db push                            # applique les migrations
```

Alternative sans CLI : copier-coller le contenu de chaque fichier de
`migrations/` dans **Supabase → SQL Editor**, dans l'ordre.

## Authentification

Dans le dashboard Supabase (**Authentication → Providers**) :

1. **Email** : activé par défaut. Créez un premier utilisateur via
   _Authentication → Users → Add user_ (ou laissez l'inscription ouverte).
2. **GitHub** (optionnel) : créez une OAuth App GitHub, renseignez `Client ID`
   et `Client Secret`, et ajoutez l'URL de callback fournie par Supabase.
3. **URL de redirection** : ajoutez vos domaines (localhost + domaine Vercel)
   dans _Authentication → URL Configuration_.

## Variables d'environnement (front)

Seules ces deux variables **publiques** sont utilisées côté application :

```bash
VITE_SUPABASE_URL=...        # URL du projet
VITE_SUPABASE_ANON_KEY=...   # clé anon / publishable
```

À placer dans `.env.local` (local, ignoré par Git) et dans les variables
d'environnement Vercel. **Sans elles, l'app tourne en mode démo** (données mock,
sans authentification).

> 🔐 Les clés `service_role` / `secret` et le mot de passe DB ne doivent
> **jamais** être exposées au front ni committées : réservées au backend.
