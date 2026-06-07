<div align="center">

<img src="./public/favicon.svg" alt="Verdex" width="72" height="72" />

# Verdex Dashboard

**Le cockpit unique pour l'admin, le DevOps et la cybersécurité.**

Santé des outils, observabilité, automations, ticketing, audits de sécurité et
remontées Proton — au même endroit, dans une interface épurée aux couleurs Verdex.

<br />

[![CI](https://github.com/Verdex-Workspace/Verdex-Dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/Verdex-Workspace/Verdex-Dashboard/actions/workflows/ci.yml)
[![Deploy](https://github.com/Verdex-Workspace/Verdex-Dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/Verdex-Workspace/Verdex-Dashboard/actions/workflows/deploy.yml)
[![Release](https://github.com/Verdex-Workspace/Verdex-Dashboard/actions/workflows/release.yml/badge.svg)](https://github.com/Verdex-Workspace/Verdex-Dashboard/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-2ee59d.svg)](./LICENSE)

![Last commit](https://img.shields.io/github/last-commit/Verdex-Workspace/Verdex-Dashboard?color=2ee59d)
![Commit activity](https://img.shields.io/github/commit-activity/m/Verdex-Workspace/Verdex-Dashboard?color=2ee59d)
![Issues](https://img.shields.io/github/issues/Verdex-Workspace/Verdex-Dashboard?color=2ee59d)
![Pull requests](https://img.shields.io/github/issues-pr/Verdex-Workspace/Verdex-Dashboard?color=2ee59d)
![Top language](https://img.shields.io/github/languages/top/Verdex-Workspace/Verdex-Dashboard?color=2ee59d)
![Repo size](https://img.shields.io/github/repo-size/Verdex-Workspace/Verdex-Dashboard?color=2ee59d)

</div>

---

## ✨ Aperçu

Le Verdex Dashboard rassemble **9 modules** dans un shell unique avec sélecteur
multi-clients et thème sombre / clair :

| Module                     | Rôle                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| 🎯 **Vue d'ensemble**      | Santé globale, alertes, tickets urgents, automations échouées    |
| 📦 **Projets & Outils**    | État par environnement + panneau de détail (README, PR, deploy…) |
| 📈 **Performance & Gains** | Latence, Web Vitals, opportunités d'optimisation IA              |
| 📊 **Logs & Métriques**    | Agrégation Grafana / Prometheus / Loki / Traefik / Docker…       |
| 🔁 **Automations**         | Graphe n8n / Make / Zapier, exécution et logs par nœud           |
| 🎫 **Ticketing**           | Kanban / Roadmap / Gantt / matrice (façon GitHub Projects)       |
| ⚙️ **Admin / Infra**       | Ports, conteneurs Docker, scripts                                |
| 🛡️ **Cybersécurité**       | Pipeline d'audit assisté par IA + rapport CVSS                   |
| ✦ **Proton Unlimited**     | Remontées Mail, Calendar, Pass, Drive…                           |

> État actuel : **fondations livrées** — shell, design system, navigation et
> module _Vue d'ensemble_ fonctionnels. Les autres modules sont en place sous
> forme de pages d'aperçu et seront implémentés un par un.

## 🧱 Stack technique

| Domaine        | Choix                                                    |
| -------------- | -------------------------------------------------------- |
| Frontend       | **Vue 3** (`<script setup>`) · **TypeScript** · **Vite** |
| Styles         | **TailwindCSS v4** + design tokens Verdex (CSS vars)     |
| État / routing | **Pinia** · **Vue Router**                               |
| Tests          | **Vitest** + Vue Test Utils · **Playwright** (e2e)       |
| Qualité        | ESLint · Prettier · Husky · lint-staged · commitlint     |
| Données        | Mock typées → **Supabase** (à venir) · **Redis** (cache) |
| Docs           | **VitePress** (thème Verdex)                             |
| CI/CD          | GitHub Actions · release-please · **Vercel**             |
| Conteneurs     | Docker multi-stage + Docker Compose (local)              |

## 🚀 Démarrage rapide

```bash
# Prérequis : Node ≥ 20, pnpm ≥ 9
pnpm install

pnpm dev            # serveur de dev      → http://localhost:5173
pnpm build          # build de production  → dist/
pnpm preview        # prévisualise le build → http://localhost:4173
```

### Avec Docker (local)

```bash
docker compose up          # app (Vite) + Redis + Postgres
docker compose --profile prod up app-prod   # image Nginx de prod → :8080
```

## 🧪 Qualité & tests

```bash
pnpm lint           # ESLint (--fix)
pnpm format         # Prettier
pnpm type-check     # vérification TypeScript
pnpm test           # tests unitaires & composants
pnpm test:cov       # avec couverture (seuil 60 %)
pnpm test:e2e       # tests end-to-end Playwright
```

## 📚 Documentation

La documentation complète vit dans [`docs/`](./docs) (site VitePress) :

```bash
pnpm docs:dev       # → http://localhost:5174
```

- 🚀 [Prise en main & architecture](./docs/guide/getting-started.md)
- 🎨 [Design system Verdex](./docs/guide/design-system.md)
- 🌍 [Environnements & déploiement](./docs/guide/deployment.md)
- 🧑‍💼 [Guide utilisateur](./docs/user-guide.md)
- 🧭 [Audit & feuille de route par phases](./docs/AUDIT.md)
- 🛠️ [Checklist infrastructure (à faire de votre côté)](./docs/infra-setup.md)
- 🤝 [Guide de contribution](./CONTRIBUTING.md)

## 🌿 Convention de commits & branches

Le projet suit les [Conventional Commits](https://www.conventionalcommits.org/)
(vérifiés par commitlint) :

```
<type>(<scope>): <description>
# ex. feat(overview): ajoute le flux d'alertes temps réel
```

Nommage des branches : `type/description-courte` — ex. `feat/projects-slideover`,
`fix/theme-flicker`, `docs/user-guide`.

## 📦 Versioning

Versioning sémantique automatisé via **release-please** : à chaque merge sur
`main`, une PR de release met à jour la version et le [CHANGELOG](./CHANGELOG.md).

## 🤝 Contribuer

Voir [CONTRIBUTING.md](./CONTRIBUTING.md). En résumé : branche dédiée → commits
conventionnels → PR documentée → CI verte → review → merge.

## 📄 Licence

[MIT](./LICENSE) © Verdex Workspace
