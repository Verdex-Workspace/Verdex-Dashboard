# Changelog

Toutes les évolutions notables de ce projet sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et le
versioning respecte [Semantic Versioning](https://semver.org/lang/fr/).
À partir de la première release, ce fichier est maintenu automatiquement par
**release-please** à partir des commits conventionnels.

## [0.2.0](https://github.com/Verdex-Workspace/Verdex-Dashboard/compare/v0.1.0...v0.2.0) (2026-06-08)


### ✨ Fonctionnalités

* **admin:** add infra data model, mock data and service ([9483f97](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/9483f97932494e0038663bb316d6863ac15b203c))
* **admin:** build Admin/Infra view (ports, Docker, scripts) ([b403ebe](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/b403ebec562d1b0c72afd1f4ae5c29596b0f2901))
* **admin:** module Admin / Infra (ports, Docker, scripts) ([d79bb54](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/d79bb545c7472f4cb4ce9a55f738257d8bb68f9d))
* **api:** add authenticated GitHub write actions (issue/label/milestone/release) ([4d325b9](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/4d325b98626b644d34c84b3fce4d3f3a11febc00))
* **api:** add update-issue write action + updateGithubIssue ([9027bd2](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/9027bd262422411984be7c42616195044b3c313d))
* **api:** add Vercel serverless GitHub aggregator (token stays server-side) ([7139aa2](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/7139aa2daacd12bea62fce2113e6292c7b328c01))
* **api:** require Supabase auth on GitHub endpoint + return repo meta ([408b64b](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/408b64b618fc4932c8ae92b1a2bf7816a88ab504))
* **api:** shared serverless libs (auth/http/cache) + /api/health ([e3d1942](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/e3d19423d2b720d5c8d8430ab308a6355d9170c8))
* **api:** socle backend & cache — libs serverless partagées + /api/health (Phase 2) ([10f4972](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/10f49729d4e66bfb409e1e653ad59cbea146356d))
* **auth:** add login page, route guard and sidebar logout ([7aff164](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/7aff16497b2d7bbb320c34f84a944e8b114b8eac))
* **auth:** add Supabase client and auth store with demo-mode fallback ([fdfa54b](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/fdfa54b08ba6c9fbb77487f26e6e3a0c4b25b010))
* **auth:** expose provider/avatar and password update in auth store ([77cf6d3](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/77cf6d3593de07203edd306bf2f9d8ebcbdcca91))
* **auth:** fondation Supabase + authentification (mode démo de repli) ([c91ed37](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/c91ed376bb808a9b73bf1a4308663b7c2e7ed9f6))
* **automations:** add workflow data model, mock data and service ([9bf8b32](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/9bf8b32cdea4e7e8567b6c45b1743f8deebfec0e))
* **automations:** build workflow graph and node-by-node execution view ([40d0c07](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/40d0c07aacc695f418a903d6c8489c16e6b2d397))
* **automations:** module Automations — graphe de workflows & exécution ([4cb7165](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/4cb7165ba6e4e67311d64206f82f11a91c6bd62a))
* **cyber:** add audit data model, mock data and service ([acf281b](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/acf281bfb0376917ca240c9cc1ce0c2c90351ec2))
* **cyber:** build 5-step audit pipeline, report and vulnerability slide-over ([943c34f](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/943c34faee4665f163978e574089d9adeab4e4b8))
* **cyber:** document-driven audit pipeline (upload → synthesis → audit → report) ([a721bdc](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/a721bdcaccf805d6211e9080ccaac7ff774593c2))
* **cyber:** module Cybersécurité — pipeline d'audit & rapport CVSS ([c9b01d3](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/c9b01d3f6078f74e7491fa204cec013c32517d21))
* **cyber:** pipeline d'audit réel — signaux → LLM → CVSS → rapport (Phase 3) ([f3dbd5d](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/f3dbd5d1142dea360dd27cfd16fa3690b621fd59))
* **cyber:** pipeline documentaire — docs → synthèse → audit → rapport (Phase 3.1) ([eb23cea](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/eb23cea7ee63bb699fa651b5fbcac6783d32f54e))
* **cyber:** real audit pipeline (signals → Claude → CVSS → report) ([6e94224](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/6e9422433badba924e83f4ed32cce6e25545ebfd))
* **db:** add milestone/size/estimate to tickets (migration 0007) ([74de06a](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/74de06aa4b519137c705f3acf72280e1fa56f497))
* **db:** add profiles migration (RLS) and Supabase setup docs ([b6725f1](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/b6725f164fda1704c18e955b0d154c0620f10c8a))
* **db:** add repo column to tools ([57ab09d](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/57ab09de5000d59f345b9dda29dec6e94ee8b085))
* **db:** add tickets table with RLS (migration 0006) ([8b818b5](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/8b818b5b1c4d49b35a818246a28f545992b01ce2))
* **db:** add tools/tool_details schema, RLS and seed migrations ([0e4a723](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/0e4a7234cc693be2cce7e89c59d0eeda11e6ff57))
* **db:** add write RLS for tools and purge demo seed ([e8524f2](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/e8524f2a6ee5053a472719f4237e8d63d44bb06e))
* **design-system:** add Verdex tokens and UI primitives ([32b6aa0](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/32b6aa0c859c3a38fe5effa757c94ac880a63359))
* **i18n:** add vue-i18n (fr/en) foundation for the app chrome ([7004c65](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/7004c65a9cc2e0850d1d67316063dda034d83fcc))
* **logs:** add logs data model, mock data and service ([5f832a1](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/5f832a123a6d60952610c208015c7764ba4cf05f))
* **logs:** build Logs & Métriques view (unified + by source) ([8fa26ba](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/8fa26bae7b3ad0fec29ee475d7059bfded213972))
* **logs:** module Logs & Métriques (agrégation multi-sources) ([51645df](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/51645df5cae7859912d0fb0c646028a77a699507))
* **profile:** add user avatar menu and settings panel (theme, language, password) ([80ff94d](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/80ff94dbb646040aa9e4c833a65fcc4990df8053))
* **profile:** menu utilisateur (avatar, paramètres, langue, thème, mot de passe) ([219da40](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/219da403696a6305d0675576363d61c6bc754f15))
* project foundation — scaffold, design system, shell & tooling ([0b61944](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/0b619449a0dd9b79e3c29d30822ce368c915f7da))
* **projects:** add tools data model, mock data and service ([fe91b0d](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/fe91b0d569045dcf77e4e9ab3950a14b024d63dd))
* **projects:** brancher Projets & Outils sur Supabase (repli mock) ([1805d7f](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/1805d7fd84e2225ba44f8919226e88fc20bcdd17))
* **projects:** build Projets & Outils view with detail slide-over ([3d19d0f](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/3d19d0f15947a3adde6fe59ee9e767fa7df4d23d))
* **projects:** create GitHub issues/labels/milestones/releases from the dashboard ([344ec14](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/344ec143b227543a5e9123960be54965d88beea4))
* **projects:** données GitHub réelles (README, commits, PR, issues, deploys) ([4ec2efa](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/4ec2efa81f12b3692f53b0dca32f0c792179c65c))
* **projects:** écritures GitHub (issues, labels, milestones, releases) ([ef8e9d9](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/ef8e9d9137851083a097292a6d711d7f556f3464))
* **projects:** enrich tool detail with real GitHub data + README (mock fallback) ([9f69dc8](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/9f69dc813b3f9001c4c729e0d68485a22831741b))
* **projects:** module Projets & Outils avec panneau de détail ([762c1ab](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/762c1ab4079997ddffc781e60bb2ae03773f4af0))
* **projects:** read tools from Supabase with automatic mock fallback ([44d3f97](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/44d3f97a539cd962e23d54a55f458d533bf11421))
* **projects:** suivi de dépôts GitHub (add/remove) + sécurisation de l'API ([3711115](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/3711115cef30f0e30d3efeca727b1d71df88dbca))
* **projects:** track/untrack GitHub repositories + empty state (real data only) ([10871c3](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/10871c35c7335f7eac17c925291f13cf89115924))
* **proton:** add Proton data model, mock data and service ([792c7ee](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/792c7ee6a2b3b70c008680dadfba01b702ea0875))
* **proton:** build Proton Unlimited consolidated view (6 widgets) ([7dc673e](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/7dc673e4373b082c498c6f5235c9dd905a3a14cb))
* **proton:** module Proton Unlimited — remontées consolidées (dernier module UI) ([4d339f6](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/4d339f6da0b7817155078ecc76fef49eda9d3747))
* **shell:** add app shell, routing and overview module ([135935b](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/135935bbe419c49f6774d93a5130017f34066e70))
* **ticketing:** add relational data model, mock data and service ([27a423e](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/27a423e5254ba183b90fa7096649d4c1f0851a4e))
* **ticketing:** add updateTicket (partial update of status/links) ([250a0d5](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/250a0d5e41ef8a1c1fd02c2cfe67be13234d4842))
* **ticketing:** build Kanban, Table, Roadmap, Gantt and Matrix views + detail panel ([50c7622](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/50c7622cd50f17b1a43e0a5846dc771c688f56df))
* **ticketing:** champs GitHub complets + édition inline du ticket (étape 1 — volet A) ([e6e21ee](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/e6e21ee83c185604a246bf3ab40600e7266aab7c))
* **ticketing:** create a GitHub issue from a ticket and link it back ([742f4f8](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/742f4f890a88cfc1f1d06fd05a7bf77cc296fb46))
* **ticketing:** créer une issue GitHub depuis un ticket (pont) ([39dc40a](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/39dc40a7b7e0fa31b157e6af5ab8d785bda28b66))
* **ticketing:** delete tickets and close GitHub issues from the dashboard ([3581cb0](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/3581cb062d8e64e787b9830b6243f90706b5d725))
* **ticketing:** edit ticket fields inline + generalize updateTicket ([8f18281](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/8f18281f5babf01af8a7836c7fd6045a24545339))
* **ticketing:** module Ticketing façon GitHub Projects (5 vues, relations, hooks Proton) ([2da35f2](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/2da35f2b4c5210cb2e868efa28cdbd2e15d6db95))
* **ticketing:** persist tickets in Supabase with create + empty state (mock fallback) ([70b2a85](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/70b2a85145a11a159d0d3a8b395d243eb6ed2bea))
* **ticketing:** persistance Supabase (création + état vide, repli mock) ([d61b746](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/d61b746ebc762f470892fcfb4b71c5d8cb026d4e))
* **ticketing:** suppression de ticket + fermeture d'issue GitHub (+ handoff) ([0b83617](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/0b836172888e399e3c65a454f078b2151054aa27))
* **ticketing:** sync edits to linked issue + data-driven Gantt/Roadmap ([62bad5a](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/62bad5ac0bfbeece9d4c8d96a4b85e4ee6875a19))
* **ticketing:** synchro auto ticket→issue + Gantt/Roadmap data-driven (étape 1 volet B + étape 2) ([b291950](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/b291950f431fe2d34b6e61de20b386a480c52a30))


### 🐛 Corrections

* **api:** add .js extensions to relative imports (ESM runtime) ([d533d6f](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/d533d6f11223b518676c2e32704625c1d8a0b7ff))
* **api:** corrige le 500 de /api/synthesis (import Upstash paresseux) ([0d58955](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/0d5895584900a22dc1f9c0cc4cc8060021b41780))
* **api:** extensions .js sur les imports relatifs (corrige TOUTES les fonctions serverless) ([8ba0ef1](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/8ba0ef18c69fb03d2e1217bd281769e6eb65dc0c))
* **api:** lazy-load Upstash + guard handlers (fix /api/synthesis 500) ([549efa2](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/549efa25bd2be883cf8f099668ffc9e0827cb034))
* **cyber:** erreurs LLM remontées + support modèles reasoning (R1) ([09b5d47](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/09b5d47ebd26da0d96593ee4b7624d8973010f14))
* **cyber:** surface LLM errors + handle reasoning models (R1) ([859f314](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/859f3141df281d321a4f9a0183505a66f10ef4d1))
* **projects:** keep detail tabs and untrack button within the slide-over ([4b6318f](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/4b6318f2f279f6a4893f1410eb9632483fd14eb3))
* **projects:** onglets du détail scrollables + bouton 'ne plus suivre' dans la vue ([524d89f](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/524d89fa894eb66fb71755ef6b1f1c5c57acf661))


### ♻️ Refactorisation

* **cyber:** provider-agnostic LLM connector (OpenAI-compatible) ([b5f3570](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/b5f3570a9233292e8e706d392cc7b8ced24a944c))


### 📝 Documentation

* add README, docs site, user guide and infra checklist ([96e38fc](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/96e38fc6e57234b5e73be58fafb079f592325635))
* add session handoff roadmap; test closeGithubIssue ([6bcdaad](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/6bcdaad5fb553a87e95f50fa1f14104932d533aa))
* audit intégral + feuille de route par phases (Phase 0) ([3385554](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/3385554be9803c199447a15b20ac4ef9d62fdb5c))
* full audit + phased roadmap ([bbfb4e4](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/bbfb4e4909321f1f178879d410f2a96c94baf98f))
* mark step 1 volet A (ticket fields + inline edit) as done ([f0adf23](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/f0adf23408c51fbd73b3a44e344d0a84a64cc067))


### 🤖 CI/CD

* add GitHub Actions, Docker and environments ([3131aab](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/3131aabdb25a89d27235d56a108177c9e529d0ac))
* durcissement sécurité + déploiement gaté sur CI (Phase 1) ([3ef23f5](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/3ef23f58e18eb9dc8e37b5ef0ea1ad07a554dc05))
* make dependency-review non-blocking until dependency graph is enabled ([a9c1c20](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/a9c1c20f1297bd94701deee4aa771b8b17e6725e))
* security hardening + gate deploy on CI ([1df2d96](https://github.com/Verdex-Workspace/Verdex-Dashboard/commit/1df2d965c4fb685ffd670d3da07e69bcd84a6c49))

## [Non publié]

### Ajouté

- Fondations du projet : scaffold Vue 3 + Vite + TypeScript + TailwindCSS v4.
- Design system Verdex (tokens, primitives UI, shell applicatif).
- Shell : sidebar groupée, sélecteur multi-clients, thème sombre/clair, routing
  des 9 modules.
- Module **Vue d'ensemble** fonctionnel (données mock + couche de services).
- Outillage qualité : ESLint, Prettier, Husky, lint-staged, commitlint.
- Tests Vitest (+ couverture) et Playwright (e2e).
- CI/CD GitHub Actions, release-please, déploiement Vercel, Docker, VitePress.
