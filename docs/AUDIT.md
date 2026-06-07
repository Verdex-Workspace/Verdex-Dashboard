# Audit & feuille de route par phases

> Audit intégral du Verdex Dashboard à date, avec l'état du fait, de la sécurité,
> du reste à faire, puis les **grandes phases** (une PR par phase) pour atteindre
> la cible : le cockpit **Admin / DevOps / Cybersécurité** de Verdex.

## En une phrase

Les **fondations et l'infrastructure sont en place et de bonne qualité**. Le
chantier restant n'est pas de « tout monter » mais de **durcir la sécurité**,
**brancher les vrais backends** (connecteurs avec repli mock) et **compléter les
modules**, en commençant par la **Cybersécurité**.

---

## 1. Ce qui est fait ✅

### Application

- **Vue 3** (`<script setup>`) · **TypeScript** · **Vite** · **TailwindCSS v4**.
- **Pinia**, **Vue Router**, **vue-i18n** (FR/EN), design system Verdex (tokens CSS,
  primitives `V*`), thème clair/sombre.
- **9 modules** présents dans l'UI. Trois sont aboutis et **connectés à Supabase**
  (RLS) avec intégration GitHub réelle (`api/github.ts`) :
  - **Vue d'ensemble**, **Projets & Outils**, **Ticketing** (Kanban/Table/Roadmap/
    Gantt/matrice, sync ticket ↔ issue, Gantt/Roadmap dérivés des tickets réels).

### Qualité & process

- ESLint, Prettier, **Husky** (pre-commit/commit-msg/pre-push), **commitlint**
  (Conventional Commits), lint-staged.
- **Tests** Vitest (unit + composants, seuil **60 %**) et **Playwright** (e2e).
- Gouvernance : `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`, Dependabot, templates
  d'issues et de PR.

### CI/CD & livraison

- **`ci.yml`** : qualité (lint/format/types) · tests + couverture · build · e2e.
- **`deploy.yml`** : déploiement Vercel — `staging` → pré-prod, `main` → prod.
- **`release.yml`** : **release-please** (versioning sémantique + CHANGELOG auto).
- **Docker** : `Dockerfile` multi-stage (dev/prod) + `docker-compose.yml`
  (app + Redis + Postgres en local).
- **Environnements** séparés : `.env.development` / `.staging` / `.production` /
  `.example`, builds `build:staging` / `build:production`.

### Documentation

- Site **VitePress** au thème Verdex : prise en main, architecture, design system,
  déploiement, **guide utilisateur**, **checklist infrastructure** (outils externes).
- **README vivant** : badges CI/Deploy/Release + statistiques du dépôt (dernier
  commit, activité, issues, PR, langage, taille).

---

## 2. Sécurité 🔐

### Points positifs

- `api/github.ts` exige un **jeton de session Supabase valide** et **valide** le
  paramètre `repo` (regex). Le `GITHUB_TOKEN` reste côté serveur.
- **RLS** activée sur les tables `tools` / `tickets`.
- Secrets jamais préfixés `VITE_` ; séparation documentée.

### Écarts à corriger (Phase 1) — ✅ traités

> Phase 1 livrée : CodeQL, dependency-review, gitleaks et `pnpm audit` ajoutés ;
> déploiement gaté sur CI verte ; en-têtes de sécurité dans `vercel.json` ;
> garde-fou méthode sur le serverless. Reste **manuel** : activer la protection de
> branche `main` côté GitHub (voir `infra-setup.md`).

| #   | Écart                                               | Correctif                                                           |
| --- | --------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Pas de **SAST**                                     | Job **CodeQL** dans la CI                                           |
| 2   | Pas d'analyse de dépendances sur PR                 | **dependency-review** + `pnpm audit`                                |
| 3   | Pas de **secret scanning**                          | **gitleaks** dans la CI                                             |
| 4   | **Déploiement non bloqué par les tests**            | Gater `deploy.yml` sur la réussite de la CI                         |
| 5   | **En-têtes de sécurité absents** (`vercel.json`)    | CSP, HSTS, X-Frame-Options, Referrer-Policy, X-Content-Type-Options |
| 6   | Pas de rate-limit / validation renforcée serverless | Garde-fous sur `api/*`                                              |
| 7   | Protection de branche `main`                        | À activer (manuel GitHub, documenté)                                |

---

## 3. Reste à faire ⏳

- **Brancher les vrais backends** de chaque module via connecteurs serverless
  (toujours avec **repli mock** → CI/preview verts sans dépendances) :
  Cybersécurité, Logs & Métriques (Prometheus/Loki/Grafana/Traefik), Automations
  (n8n), Admin/Infra (Docker), Performance & Gains, Proton.
- **Cache Redis (Upstash)** à câbler en production (présent uniquement en local).
- **Couverture de tests** à monter progressivement (cible **> 75 %**).
- Reprendre fidèlement les **wireframes** du design Verdex, **sans les annotations**.

---

## 4. Feuille de route par phases

Chaque phase = **une PR** : branche dédiée → CI verte → aperçu avant push →
review → merge. Pattern « module » = tranche verticale : **connecteur serverless
(+ repli mock) → service `src/services` → UI conforme au design → tests → docs**.

| Phase | Objectif                                                                                       | Branche                 |
| ----- | ---------------------------------------------------------------------------------------------- | ----------------------- |
| **0** | **Audit & cadrage** (ce document + roadmap)                                                    | `docs/audit-roadmap`    |
| **1** | **Sécurité & durcissement CI/CD** (CodeQL, dependency-review, gitleaks, deploy gaté, en-têtes) | `ci/security-hardening` |
| **2** | **Socle backend & cache** (Upstash Redis, abstraction connecteur, `/api/health`)               | `feat/backend-core`     |
| **3** | **Cybersécurité** — audit (signaux → **API Claude** → score CVSS → rapport)                    | `feat/cyber-audit`      |
| **4** | **Observabilité** — Logs & Métriques (Prometheus/Loki/Grafana/Traefik)                         | `feat/observability`    |
| **5** | **Admin / Infra** — conteneurs, ports, scripts (Docker, lecture seule)                         | `feat/admin-infra`      |
| **6** | **Automations** — connecteur n8n                                                               | `feat/automations`      |
| **7** | **Performance & Gains** — Web Vitals, Vercel Analytics                                         | `feat/performance`      |
| **8** | **Proton Unlimited** — Mail/Calendar/Drive (Bridge/exports)                                    | `feat/proton`           |
| **9** | **Finitions** — couverture > 75 %, a11y, i18n, polish docs                                     | `chore/hardening`       |

**Décisions actées** : Cybersécurité en premier · connecteurs avec repli mock ·
LLM d'audit = **API Claude (Anthropic)** · cache prod = **Upstash Redis**.

---

## 5. Outils à ajouter au fil des phases

`@upstash/redis` (P2) · `@anthropic-ai/sdk` (P3, serverless) ·
`github/codeql-action`, `actions/dependency-review-action`,
`gitleaks/gitleaks-action` (P1) · `@vercel/analytics` (P7).

## 6. Ce qui dépend de toi

Voir la **[checklist infrastructure](./infra-setup.md)** : protection de `main`,
secrets Vercel, projet Supabase, Upstash, clé API Anthropic, puis (plus tard)
Prometheus / Loki / Grafana / Traefik / n8n / Proton. Chaque phase met à jour
cette checklist avec ce que j'attends précisément de ta part.
