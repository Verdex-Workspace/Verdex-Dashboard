# Guide de contribution — Verdex Dashboard 🌿

Merci de contribuer ! Ce guide décrit le workflow, les conventions et les
attentes de qualité du projet.

## 1. Prérequis

- **Node.js ≥ 20** et **pnpm ≥ 9** (`corepack enable` recommandé)
- Cloner le dépôt puis :

```bash
pnpm install        # installe les dépendances + les hooks Git (Husky)
```

## 2. Workflow Git

```
main        ← production (protégée) — déploiement Vercel prod
 └─ staging ← pré-production — déploiement Vercel staging, tests e2e
     └─ feature/...  ← votre travail
```

1. Créez une branche depuis `main` (ou `staging`) :
   ```bash
   git checkout -b feat/mon-sujet
   ```
2. Codez, committez (commits conventionnels — voir §3).
3. Poussez et ouvrez une **Pull Request** (gabarit fourni).
4. La CI doit être **verte** (lint, types, tests, build, e2e).
5. Après review et merge sur `main`, release-please prend le relais.

### Nommage des branches

| Préfixe     | Usage                   | Exemple                    |
| ----------- | ----------------------- | -------------------------- |
| `feat/`     | nouvelle fonctionnalité | `feat/logs-loki-connector` |
| `fix/`      | correction de bug       | `fix/theme-flicker`        |
| `docs/`     | documentation           | `docs/infra-setup`         |
| `refactor/` | refactorisation         | `refactor/ui-primitives`   |
| `chore/`    | maintenance / outillage | `chore/bump-deps`          |

## 3. Commits conventionnels

Format imposé (vérifié par **commitlint** au commit) :

```
<type>(<scope optionnel>): <description à l'impératif>
```

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, `revert`.

Exemples :

```
feat(ticketing): ajoute la vue Kanban
fix(overview): corrige le tri des alertes par sévérité
docs(readme): met à jour la section déploiement
```

## 4. Qualité de code

Avant de pousser (les hooks Husky le vérifient aussi) :

```bash
pnpm lint:check     # ESLint
pnpm format:check   # Prettier
pnpm type-check     # TypeScript
pnpm test           # tests unitaires & composants
```

- **Couverture** : seuil minimum **60 %** (lignes/branches/fonctions/statements).
  Ajoutez des tests pour toute nouvelle logique.
- Respectez le **design system** : réutilisez les primitives de
  `src/components/ui` et les tokens CSS (`--accent`, `--paper`…), pas de couleurs
  en dur.

## 5. Structure du projet

```
src/
├─ assets/styles/   # design system (tokens, primitives, shell)
├─ components/
│  ├─ ui/           # primitives réutilisables (VFrame, VChip, VKpi…)
│  └─ layout/       # shell (sidebar, top bar, slide-over)
├─ composables/     # logique réutilisable
├─ data/            # navigation + données mock
├─ services/        # couche d'accès aux données (→ Supabase à terme)
├─ stores/          # Pinia (theme, ui, detail)
├─ types/           # types partagés
├─ router/          # routes des modules
└─ views/           # une vue par module
tests/              # unit · component · e2e
docs/               # site VitePress
```

## 6. Hooks Git (Husky)

| Hook         | Action                                           |
| ------------ | ------------------------------------------------ |
| `pre-commit` | `lint-staged` (ESLint + Prettier sur le staging) |
| `commit-msg` | `commitlint` (valide le message de commit)       |
| `pre-push`   | `type-check` + `test`                            |

## 7. Ouvrir une PR

- Titre au format Conventional Commits.
- Remplissez le gabarit (objectif, changements, tests, captures si UI).
- Liez l'issue concernée (`Closes #123`).
- Une PR = un sujet cohérent et reviewable.

Bon code ! 🌿
