# Checklist infrastructure (à faire de votre côté)

Cette page liste **ce que vous devez mettre en place**, dans l'ordre, pour passer
des données mock à un dashboard pleinement connecté. Chaque section indique
**pourquoi**, **comment**, et **ce que vous devez me transmettre** pour que je
fasse le branchement côté code.

> 🟢 = nécessaire maintenant · 🟡 = bientôt · ⚪ = quand le module arrive

---

## 1. 🟢 GitHub — finaliser le dépôt

Pour que la CI/CD et les déploiements fonctionnent.

- [ ] **Protéger `main`** : Settings → Branches → règle sur `main` :
  - exiger une **PR** + **revue** avant merge ;
  - exiger les **status checks** verts : `CI` (qualité/tests/build/e2e), `CodeQL`,
    et les jobs `Security` (gitleaks, audit) ;
  - exiger la branche **à jour** avant merge.
- [ ] Créer la branche **`staging`** (pré-production) avec la même protection.
- [ ] Activer **Dependabot** (déjà configuré via `.github/dependabot.yml`) et, dans
      Settings → Code security, activer **Dependency graph**, **Code scanning
      (CodeQL)** et **Secret scanning**.
  - ℹ️ Le **Dependency graph** est requis par le job `dependency-review` ; tant
    qu'il n'est pas activé, ce job reste informatif (non bloquant) — la porte
    bloquante sur les vulnérabilités est assurée par `pnpm audit`.
- [ ] Ajouter les **secrets** (Settings → Secrets and variables → Actions) :
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (voir §2)

> 🔒 **Déploiement gaté** : le workflow `deploy.yml` ne s'exécute **qu'après une CI
> verte** (déclenché par `workflow_run`). Un push qui casse la CI ne sera pas déployé.

## 2. 🟢 Vercel — hébergement

- [ ] Créer un compte / une équipe Vercel et **importer le dépôt**
      (framework détecté : **Vite**).
- [ ] Définir les **variables d'environnement** par environnement
      (Production / Preview) : `VITE_APP_ENV`, `VITE_APP_NAME`,
      `VITE_API_BASE_URL`, et plus tard les clés Supabase.
- [ ] Récupérer **`VERCEL_ORG_ID`** et **`VERCEL_PROJECT_ID`**
      (fichier `.vercel/project.json` après `vercel link`, ou dashboard).
- [ ] Générer un **`VERCEL_TOKEN`** (Account Settings → Tokens).

➡️ **À me transmettre** : confirmation que le projet Vercel est créé (les
secrets, eux, restent chez vous dans GitHub).

## 3. 🟡 Supabase — base de données & auth

Remplacera les données mock (`src/data/mock`) via la couche `src/services`.

- [ ] Créer un projet sur [supabase.com](https://supabase.com).
- [ ] Noter l'**URL du projet** et la **clé `anon`** (publique).
- [ ] (Plus tard) définir le schéma : `clients`, `tools`, `alerts`, `tickets`,
      `automations`…
- [ ] Configurer l'**authentification** (email, OAuth GitHub, etc.).

➡️ **À me transmettre** : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
(je les mets dans `.env.local` / Vercel et je branche le client Supabase).

## 4. 🟡 Redis — cache (Upstash)

Le code utilise un cache **Upstash Redis (REST)** via `api/_lib/cache.ts`. Sans
configuration, le cache est simplement désactivé (dégradation gracieuse) — rien
ne casse.

- [ ] **En local** : Redis fourni par `docker compose up` (port `6379`) — optionnel.
- [ ] **En prod** : créer une base **Upstash** (plan gratuit) sur
      [upstash.com](https://upstash.com), section _Redis_, et récupérer les
      identifiants **REST**.

➡️ **À me transmettre** (secrets serveur, à mettre dans Vercel) :
`UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`.

## 4 bis. 🟢 Vérifier la santé du backend

Une fois déployé, `GET /api/health` renvoie l'état (booléens, sans secret) :
`{ services: { supabase, redis, github } }`. Pratique pour confirmer que les
variables d'environnement sont bien prises en compte sur Vercel.

## 5. 🟢 Docker — environnement local

- [ ] Installer **Docker Desktop**.
- [ ] Lancer la stack : `docker compose up` (app + Redis + Postgres).

Aucune action de configuration supplémentaire : tout est dans `docker-compose.yml`.

---

## 6. ⚪ Observabilité (module Logs & Métriques)

L'objectif : exposer des endpoints/API que le dashboard interrogera. Le plus
simple est de tout déployer derrière **Traefik** via Docker Compose.

### Prometheus 🟡

- [ ] Déployer Prometheus (scrape de vos services).
- [ ] Exposer l'API de requête (`/api/v1/query`).
- ➡️ À me transmettre : URL de base Prometheus + (optionnel) token.

### Loki 🟡

- [ ] Déployer Loki + (Promtail/Alloy) pour l'ingestion des logs.
- ➡️ À me transmettre : URL Loki (requêtes LogQL).

### Grafana ⚪

- [ ] Déployer Grafana branché sur Prometheus/Loki.
- [ ] Créer un **service account token** (lecture) pour l'API / l'embed.
- [ ] Autoriser l'**embedding** si vous voulez des panneaux en iframe.
- ➡️ À me transmettre : URL Grafana + token + IDs des dashboards à intégrer.

### Traefik ⚪

- [ ] Utiliser Traefik comme reverse-proxy (TLS, routage).
- [ ] Activer l'**API/dashboard** Traefik (lecture) pour remonter routes & santé.
- ➡️ À me transmettre : URL de l'API Traefik (+ auth).

> ⚠️ **Sécurité** : n'exposez jamais publiquement Prometheus, Loki ou Postgres.
> Placez-les sur un réseau interne et exposez uniquement via Traefik avec auth.
> (Le module Cybersécurité remontera justement ce genre de risque.)

## 7. ⚪ n8n (module Automations)

- [ ] Déployer **n8n** (Docker) ou utiliser n8n Cloud.
- [ ] Générer une **clé API** n8n (Settings → API).
- ➡️ À me transmettre : URL n8n + clé API (pour lister workflows, exécutions,
  relancer).
- [ ] (Make / Zapier) : fournir les tokens API correspondants si utilisés.

## 8. ⚪ Proton (module Proton Unlimited)

> ⚠️ Proton n'expose pas d'API publique grand public. Les remontées dépendront
> de ce qui est disponible (Proton Bridge pour Mail/IMAP, exports, etc.).

- [ ] Vérifier les accès disponibles (Proton Bridge, exports calendrier ICS…).
- ➡️ On définira ensemble la stratégie de remontée réaliste (probablement via un
  petit service intermédiaire).

## 9. 🟡 Cybersécurité (audit IA)

Le pipeline d'audit (`/api/audit`) collecte des signaux GitHub, fait analyser par un
**LLM (connecteur compatible OpenAI)**, recalcule le **score CVSS localement** et
persiste le rapport dans Supabase (`audit_reports`, migration `0008`). Sans LLM
configuré, repli mock déterministe.

Le connecteur est **agnostique** : GitHub Models (gratuit), Groq, OpenRouter, Mistral,
OpenAI, ou Ollama (local) — on change de fournisseur via l'env, sans toucher au code.

**Option recommandée — GitHub Models (gratuit)** :

- [ ] Créer un **PAT fine-grained** (Settings → Developer settings → Tokens) avec la
      permission **`models: read`**.
- [ ] Choisir un modèle dans le catalogue [github.com/marketplace/models](https://github.com/marketplace/models)
      — ⚠️ **pas de modèle Anthropic/Claude** dans ce catalogue.
  - ✅ **Recommandé : `openai/gpt-4.1`** (rapide, JSON fiable, limite de débit confortable).
  - ⚠️ **`deepseek/DeepSeek-R1`** fonctionne mais c'est un modèle « reasoning » :
    sur le tier gratuit GitHub Models il est **limité à ~1 requête/minute** et son
    raisonnement consomme des tokens — notre pipeline fait **2 appels** (synthèse +
    audit), il faut donc espacer, sinon le 2ᵉ est _rate-limité_ (repli mock affiché
    avec la raison). `LLM_MAX_TOKENS` est réglable (défaut 4096).
- [ ] Appliquer les migrations `0008_audit_reports.sql` **et** `0009_audit_documents.sql`
      (`supabase db push`) — `0009` crée aussi le **bucket Storage privé `audit-docs`**
      pour les documents fournis (le texte extrait est analysé par le LLM).
- ➡️ **À mettre dans Vercel** (secrets serveur) :
  - `LLM_BASE_URL=https://models.github.ai/inference`
  - `LLM_API_KEY=<votre PAT>`
  - `LLM_MODEL=<modèle choisi>`

> 🔐 **Confidentialité** : le module audite votre sécurité (il transmet des signaux
> sur vos dépôts). Vérifiez la politique « données » du fournisseur choisi ; pour une
> confidentialité maximale, **Ollama (local)** ne fait sortir aucune donnée.

---

## Récapitulatif « à me transmettre »

| Élément                             | Type            | Priorité |
| ----------------------------------- | --------------- | -------- |
| Projet Vercel créé                  | confirmation    | 🟢       |
| `VITE_SUPABASE_URL` + clé `anon`    | config publique | 🟡       |
| `UPSTASH_REDIS_REST_URL` + `_TOKEN` | secrets serveur | 🟡       |
| URLs Prometheus / Loki              | config + token  | ⚪       |
| URL + token Grafana                 | secret serveur  | ⚪       |
| URL API Traefik                     | secret serveur  | ⚪       |
| URL + clé API n8n                   | secret serveur  | ⚪       |
| `LLM_BASE_URL`/`_API_KEY`/`_MODEL`  | secrets serveur | 🟡       |

> 🔐 **Rappel** : tout ce qui est _secret serveur_ ne doit **jamais** être
> préfixé `VITE_` ni committé. On le met dans `.env.local` (local) ou dans les
> variables d'environnement Vercel.
