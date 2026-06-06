# Checklist infrastructure (à faire de votre côté)

Cette page liste **ce que vous devez mettre en place**, dans l'ordre, pour passer
des données mock à un dashboard pleinement connecté. Chaque section indique
**pourquoi**, **comment**, et **ce que vous devez me transmettre** pour que je
fasse le branchement côté code.

> 🟢 = nécessaire maintenant · 🟡 = bientôt · ⚪ = quand le module arrive

---

## 1. 🟢 GitHub — finaliser le dépôt

Pour que la CI/CD et les déploiements fonctionnent.

- [ ] **Protéger `main`** : Settings → Branches → règle sur `main`
      (exiger PR + CI verte avant merge).
- [ ] Créer la branche **`staging`** (pré-production).
- [ ] Activer **Dependabot** (déjà configuré via `.github/dependabot.yml`).
- [ ] Ajouter les **secrets** (Settings → Secrets and variables → Actions) :
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (voir §2)

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

## 4. 🟡 Redis — cache

- [ ] **En local** : déjà fourni par `docker compose up` (port `6379`).
- [ ] **En prod** : un Redis managé (Upstash s'intègre très bien à Vercel,
      ou Redis Cloud).

➡️ **À me transmettre** : l'`REDIS_URL` de prod (secret serveur, pas `VITE_`).

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

## 9. ⚪ Cybersécurité (audit IA)

- [ ] Choisir le fournisseur LLM pour l'analyse (ex. API Claude d'Anthropic).
- [ ] Préparer un espace de stockage pour les rapports (Supabase Storage / Proton
      Drive).
- ➡️ À me transmettre : clé API du LLM (secret serveur).

---

## Récapitulatif « à me transmettre »

| Élément                          | Type            | Priorité |
| -------------------------------- | --------------- | -------- |
| Projet Vercel créé               | confirmation    | 🟢       |
| `VITE_SUPABASE_URL` + clé `anon` | config publique | 🟡       |
| `REDIS_URL` (prod)               | secret serveur  | 🟡       |
| URLs Prometheus / Loki           | config + token  | ⚪       |
| URL + token Grafana              | secret serveur  | ⚪       |
| URL API Traefik                  | secret serveur  | ⚪       |
| URL + clé API n8n                | secret serveur  | ⚪       |
| Clé API LLM (audit)              | secret serveur  | ⚪       |

> 🔐 **Rappel** : tout ce qui est _secret serveur_ ne doit **jamais** être
> préfixé `VITE_` ni committé. On le met dans `.env.local` (local) ou dans les
> variables d'environnement Vercel.
