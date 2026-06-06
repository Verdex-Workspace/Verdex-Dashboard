# Prise en main

Cette page vous met le projet en route en quelques minutes.

## Prérequis

- **Node.js ≥ 20** (le dépôt cible Node 22 — voir `.nvmrc`)
- **pnpm ≥ 9** — activez-le via Corepack :
  ```bash
  corepack enable
  ```
- (Optionnel) **Docker** pour la stack locale complète.

## Installation

```bash
git clone https://github.com/Verdex-Workspace/Verdex-Dashboard.git
cd Verdex-Dashboard
pnpm install      # installe aussi les hooks Git (Husky)
```

## Scripts essentiels

| Commande          | Description                             |
| ----------------- | --------------------------------------- |
| `pnpm dev`        | Serveur de développement (`:5173`)      |
| `pnpm build`      | Build de production (type-check + Vite) |
| `pnpm preview`    | Prévisualise le build (`:4173`)         |
| `pnpm lint`       | ESLint avec correction automatique      |
| `pnpm format`     | Formatage Prettier                      |
| `pnpm type-check` | Vérification TypeScript                 |
| `pnpm test`       | Tests unitaires & composants (Vitest)   |
| `pnpm test:cov`   | Tests avec rapport de couverture        |
| `pnpm test:e2e`   | Tests end-to-end (Playwright)           |
| `pnpm docs:dev`   | Site de documentation (VitePress)       |

## Variables d'environnement

Les variables publiques (préfixe `VITE_`) sont versionnées par mode :
`.env.development`, `.env.staging`, `.env.production`.

Pour vos **secrets locaux**, copiez l'exemple :

```bash
cp .env.example .env.local
```

`.env.local` est ignoré par Git. Voir la
[checklist infrastructure](/infra-setup) pour les valeurs à renseigner
(Supabase, etc.).

## Avec Docker

```bash
docker compose up         # app (Vite, :5173) + Redis (:6379) + Postgres (:5432)
```

Pour tester l'image de production servie par Nginx :

```bash
docker compose --profile prod up app-prod   # → http://localhost:8080
```

## Et ensuite ?

- Comprendre l'organisation du code → [Architecture](/guide/architecture)
- Réutiliser les composants → [Design system](/guide/design-system)
- Comprendre les environnements → [Déploiement](/guide/deployment)
