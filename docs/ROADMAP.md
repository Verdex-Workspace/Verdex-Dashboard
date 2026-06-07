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

## Modules (9) — tous en UI

✅ Vue d'ensemble · Projets & Outils · Logs & Métriques · Ticketing · Cybersécurité
· Automations · Admin/Infra · Proton Unlimited · ⏳ **Performance & Gains** (encore
en page d'aperçu — à compléter).

## Backend réel (Supabase + GitHub)

- **Auth** : login email + GitHub OAuth, garde de routes, menu profil (avatar
  GitHub/Gravatar/initiales), paramètres (thème, langue, mot de passe).
- **Projets & Outils** : tables `tools`/`tool_details` (RLS), **suivi de dépôts**
  (add/remove), détail enrichi en **données GitHub réelles** (README, commits, PR,
  issues, déploiements) via `/api/github`. **Écritures GitHub** (issue, label,
  milestone, release) + **fermeture d'issue** (onglet Issues).
- **Ticketing** : table `tickets` (RLS), création/**suppression**, **état vide**,
  **pont ticket → issue GitHub** (création + lien persistant).
- Migrations dans `supabase/migrations/` (jusqu'à `0006_tickets.sql`). Appliquer
  via `supabase db push`.

## Variables d'environnement

- Front (Vercel + `.env.local`) : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Serveur (Vercel) : `GITHUB_TOKEN` (fine-grained, `Issues: R/W` + `Contents: R/W`
  pour les écritures ; org `Verdex-Workspace`).

## 🔜 Prochaines étapes (priorisées)

1. **Champs GitHub complets sur le ticket** (cf. capture GitHub Projects) :
   **assignés, labels, type, milestone, statut, size, estimate, relations**.
   - Étendre `tickets` (colonnes/JSONB) + `AddTicketPanel`/`TicketDetailPanel`
     (édition inline) + `updateTicket` (déjà partiel).
   - **Synchro ticket ↔ issue** dans les deux sens (assignés/labels/milestone/état)
     via `/api/github` (étendre les actions write : assignees, milestone, state).
2. **Reflet automatique multi-vues** : statut/échéance/assigné du ticket pilotent
   **Kanban** (déjà par statut), **Gantt** & **Roadmap** (dériver des deadlines/sprints
   réels au lieu du mock), **filtre par assigné** (déjà présent, à brancher sur données réelles).
   - Rendre roadmap/gantt **data-driven** depuis `tickets` (sprint/deadline) au lieu du mock.
3. **Drag-and-drop Kanban** → met à jour `status` (`updateTicket`).
4. **Performance & Gains** : compléter le module (Web Vitals/Lighthouse, Vercel Analytics).
5. **Connecteur Proton** (Calendar/Drive/Mail + génération de rapports) — backend
   dédié ; active les « Actions » du ticket (deadline→Calendar, rapport→Drive, alerte→Mail).
6. **Wiki GitHub** (git-based) — étape spécifique.

## Notes techniques utiles

- L'API GitHub **ne supprime pas** une issue → on la **ferme** (PATCH state=closed).
- `/api/github` est **exclu** d'ESLint/typecheck (hors `src`), POST = écritures.
- Tests qui touchent le chemin Supabase : **mocker `@/lib/supabase`** (voir
  `tests/unit/*.supabase.spec.ts`). Repli mock = supabase `null` (pas d'env).
