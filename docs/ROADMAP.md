# Verdex Dashboard — État & feuille de route (handoff)

> 📌 **Reprise de session** : ce fichier + le `git log` + `docs/` constituent la
> mémoire du projet. Dans une nouvelle fenêtre, demande à Claude de **lire
> `docs/ROADMAP.md`, `docs/guide/architecture.md` et `git log --oneline -30`**,
> puis d'enchaîner sur « Prochaines étapes ».

## Stack & conventions

- **Vue 3 + Vite + TypeScript + TailwindCSS v4**, Pinia, Vue Router, vue-i18n (FR/EN).
- **Supabase** (auth + Postgres, RLS) · **fonction serverless Vercel** `api/github.ts`
  (lecture/écriture GitHub, jeton serveur, **auth Supabase requise**).
- Design system Verdex : `src/assets/styles/` + primitives `src/components/ui` (`V*`).
- **Couche services** (`src/services/*`) = frontière de données, avec **repli mock**
  automatique quand Supabase n'est pas configuré (mode démo → CI/dev verts).
- Qualité : ESLint/Prettier, Husky (pre-commit/commit-msg/pre-push), Vitest
  (couverture seuil 60 %), Playwright (e2e Chromium+Firefox). CI/CD GitHub Actions
  - release-please + déploiement Vercel. **Conventional Commits** obligatoires.
- Workflow : branche `type/sujet` → PR vers `main` → CI verte → merge.
  **Toujours montrer un aperçu avant push.** Compte GitHub : **CocoDevAI**.

## Modules (9) — état réel

- ✅ **Backés (Supabase + GitHub)** : Vue d'ensemble · Projets & Outils · Ticketing.
- ⏳ **UI en place, backend à brancher** (connecteurs à venir, cf. phases) :
  Logs & Métriques · Automations · Admin/Infra · Cybersécurité · Proton Unlimited ·
  Performance & Gains.

> 🧭 **Audit complet & phases** : voir [`docs/AUDIT.md`](./AUDIT.md).

## Backend réel (Supabase + GitHub)

- **Auth** : login email + GitHub OAuth, garde de routes, menu profil (avatar
  GitHub/Gravatar/initiales), paramètres (thème, langue, mot de passe).
- **Projets & Outils** : tables `tools`/`tool_details` (RLS), **suivi de dépôts**
  (add/remove), détail enrichi en **données GitHub réelles** (README, commits, PR,
  issues, déploiements) via `/api/github`. **Écritures GitHub** (issue, label,
  milestone, release) + **fermeture d'issue** (onglet Issues).
- **Ticketing** : table `tickets` (RLS, + `milestone`/`size`/`estimate`),
  création/**suppression**, **état vide**, **édition inline** (statut, priorité, type,
  assigné, milestone, size, estimate, deadline, sprint, **labels** en sélection guidée)
  via `updateTicket` (patch générique), **pont ticket → issue GitHub** (création + lien
  persistant) et **synchro auto** des éditions vers l'issue liée (état/labels/milestone/
  assignés). **Roadmap & Gantt dérivés des tickets réels** (`derive.ts`).
- Migrations dans `supabase/migrations/` (jusqu'à `0007_tickets_fields.sql`).
  Appliquer via `supabase db push`.

## Variables d'environnement

- Front (Vercel + `.env.local`) : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Serveur (Vercel) : `GITHUB_TOKEN` (fine-grained, `Issues: R/W` + `Contents: R/W`
  pour les écritures ; org `Verdex-Workspace`).

## 🗺️ Feuille de route par phases (1 PR par phase)

Détail et justification dans [`docs/AUDIT.md`](./AUDIT.md). Décisions actées :
Cybersécurité d'abord · connecteurs avec **repli mock** · LLM d'audit = **API Claude**
· cache prod = **Upstash Redis**.

| Phase | Objectif                                                                          | État        |
| ----- | --------------------------------------------------------------------------------- | ----------- |
| 0     | **Audit & cadrage** (AUDIT.md + roadmap)                                          | ✅ fait     |
| 1     | **Sécurité & CI/CD** (CodeQL, dependency-review, gitleaks, deploy gaté, en-têtes) | ✅ fait     |
| 2     | **Socle backend & cache** (Upstash Redis, abstraction connecteur, `/api/health`)  | ✅ fait     |
| 3     | **Cybersécurité** (signaux → API Claude → CVSS → rapport)                         | 🟢 en cours |
| 4     | **Observabilité** (Prometheus/Loki/Grafana/Traefik)                               | ⏳          |
| 5     | **Admin / Infra** (Docker, ports, scripts — lecture seule)                        | ⏳          |
| 6     | **Automations** (connecteur n8n)                                                  | ⏳          |
| 7     | **Performance & Gains** (Web Vitals, Vercel Analytics)                            | ⏳          |
| 8     | **Proton Unlimited** (Mail/Calendar/Drive)                                        | ⏳          |
| 9     | **Finitions** (couverture > 75 %, a11y, i18n, polish)                             | ⏳          |

### Déjà livré (étape 1 « Tickets façon GitHub Projects »)

- **Volet A** : `tickets` étendu (`milestone`/`size`/`estimate`, migration `0007`) +
  édition inline + `AddTicketPanel` enrichi + `updateTicket` générique.
- **Volet B** : synchro auto ticket → issue (état/labels/milestone/assignés) via
  l'action `update-issue` ; **Gantt & Roadmap dérivés des tickets réels** (`derive.ts`).

## Notes techniques utiles

- L'API GitHub **ne supprime pas** une issue → on la **ferme** (PATCH state=closed).
- `/api/github` est **exclu** d'ESLint/typecheck (hors `src`), POST = écritures.
- Tests qui touchent le chemin Supabase : **mocker `@/lib/supabase`** (voir
  `tests/unit/*.supabase.spec.ts`). Repli mock = supabase `null` (pas d'env).
