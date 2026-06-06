# Environnements & déploiement

## Les trois environnements

| Environnement          | Branche   | Fichier d'env      | Cible                        |
| ---------------------- | --------- | ------------------ | ---------------------------- |
| **Développement**      | locale    | `.env.development` | `pnpm dev` / Docker local    |
| **Staging** (pré-prod) | `staging` | `.env.staging`     | Vercel (preview) — tests e2e |
| **Production**         | `main`    | `.env.production`  | Vercel (production)          |

Les fichiers `.env.<mode>` ne contiennent que de la **configuration publique**
(préfixe `VITE_`). Les **secrets** vont dans `.env.local` (local) ou dans les
**variables d'environnement Vercel** (staging/prod).

## Pipeline CI/CD

```
 PR / push                merge sur main
    │                          │
    ▼                          ▼
┌─────────┐   verte   ┌──────────────────┐   ┌───────────────────┐
│   CI    │──────────▶│  release-please   │   │  Deploy (Vercel)   │
│ lint    │           │  PR de release    │   │  staging / prod    │
│ types   │           │  + CHANGELOG      │   └───────────────────┘
│ tests   │           └──────────────────┘
│ build   │
│ e2e     │
└─────────┘
```

### `ci.yml` — avant toute mise en production

Sur chaque PR et push (`main`, `staging`, `develop`) :

1. **Qualité** — `lint:check`, `format:check`, `type-check`
2. **Tests** — `test:cov` (+ artefact de couverture)
3. **Build** — `pnpm build`
4. **E2E** — Playwright (Chromium + Firefox)

### `release.yml` — versioning & changelog

À chaque push sur `main`, **release-please** lit les commits conventionnels et
ouvre/maintient une **PR de release** qui met à jour la version (`package.json`)
et le `CHANGELOG.md`. Le merge de cette PR crée le tag et la GitHub Release.

### `deploy.yml` — Vercel

- push sur `staging` → déploiement **preview/staging**
- push sur `main` → déploiement **production**

## Configuration Vercel

1. Importer le dépôt dans Vercel (framework détecté : **Vite**).
2. Renseigner les variables d'environnement (par environnement) dans le
   dashboard Vercel.
3. Pour le déploiement piloté par GitHub Actions, ajouter les **secrets** du
   dépôt (Settings → Secrets → Actions) :
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

> Sans ces secrets, le workflow `deploy.yml` est ignoré : vous pouvez aussi
> laisser l'intégration Git native de Vercel gérer les déploiements.

## Docker (auto-hébergement / local)

L'image multi-stage (`Dockerfile`) produit une image **Nginx** servant le build
statique. Utile en local ou pour un déploiement auto-hébergé ; la production
recommandée reste Vercel.

```bash
docker build --target prod -t verdex-dashboard:prod .
docker run -p 8080:80 verdex-dashboard:prod
```
