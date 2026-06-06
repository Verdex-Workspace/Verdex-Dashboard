# Guide utilisateur

Bienvenue sur le **Verdex Dashboard** 🌿 — votre cockpit pour piloter outils,
infrastructure et sécurité. Ce guide vous explique **quoi faire, comment et où**,
dès votre arrivée sur l'application.

## 1. L'écran d'accueil

À la connexion, vous arrivez sur la **Vue d'ensemble**. En 5 secondes, vous voyez :

- **Les indicateurs clés** (en haut) : outils en ligne, alertes actives, tickets
  urgents, automations échouées, uptime moyen.
- **Le flux d'alertes** (temps réel) : cliquez une alerte pour ouvrir son
  **panneau de détail** (contexte, occurrences, remédiation suggérée).
- **Les automations échouées** : avec un bouton _rejouer_.
- **Les tickets urgents** et l'**activité récente** (push, déploiements, releases).

> 💡 Astuce : presque tout est cliquable. Une carte ou une ligne ouvre le détail
> correspondant.

## 2. Se repérer dans l'interface

### La barre latérale (à gauche)

Les modules sont regroupés par thème :

| Groupe                | Modules                                         |
| --------------------- | ----------------------------------------------- |
| **Pilotage**          | Vue d'ensemble · Projets & Outils · Performance |
| **Observabilité**     | Logs & Métriques · Automations                  |
| **Delivery**          | Ticketing · Admin / Infra                       |
| **Sécurité & Outils** | Cybersécurité · Proton Unlimited                |

Cliquez sur un module pour l'ouvrir. Le module actif est surligné en vert.

### Le sélecteur de client (en haut de la barre latérale)

Cliquez dessus pour **basculer d'espace** (vos projets perso ou ceux d'un
client). Tout le dashboard s'adapte au contexte choisi.

### La barre du haut

- **Fil d'Ariane** : `Client / Module` — vous savez toujours où vous êtes.
- **Bouton ☾ / ☀** : bascule entre thème **sombre** et **clair**.
- **Bouton ☰** (sur petit écran) : ouvre/ferme la barre latérale.

## 3. Les modules, un par un

### 🎯 Vue d'ensemble

Votre tableau de bord du matin. Repérez l'urgent, agissez d'un clic.

### 📦 Projets & Outils

L'état de tous vos outils par environnement (prod / staging / dev). Cliquez une
carte → un **panneau glisse depuis la droite** avec README, commits, PR, issues
et déploiements de l'outil.

### 📈 Performance & Gains

Deux lectures : la **performance technique** (latence, erreurs, Web Vitals) et
les **gains** — quelles tâches automatiser via l'IA, et le bénéfice estimé.

### 📊 Logs & Métriques

Toutes vos sources (Grafana, Prometheus, Loki, Traefik, Docker, Vercel…) au même
endroit. Vue **unifiée** ou **par source**, avec recherche et suivi en direct.

### 🔁 Automations

Vos workflows (n8n, Make, Zapier) sous forme de **graphe**. Lancez une
exécution, suivez les logs **nœud par nœud**, rejouez en cas d'échec.

### 🎫 Ticketing

Un backlog unique, plusieurs vues : **Kanban**, **Roadmap**, **Gantt** et
**matrice de priorisation** (impact × effort). Créez un ticket via _+ ticket_.

### ⚙️ Admin / Infra

Le sous-bassement technique : **ports** et leur exposition, **conteneurs
Docker**, et **scripts** des projets.

### 🛡️ Cybersécurité

Un audit guidé en 5 étapes : déposez vos documents → l'IA les analyse → génère
les schémas → lance l'audit → produit un **rapport** (vulnérabilités classées par
CVSS, causes, remédiations, export PDF).

### ✦ Proton Unlimited

Vue consolidée de votre Proton : Mail, Calendar, Pass, Authenticator, Drive,
Docs & Sheets. Lecture seule, ouverture en un clic vers l'app concernée.

## 4. Gestes utiles

| Je veux…                    | Où / comment                               |
| --------------------------- | ------------------------------------------ |
| Changer de client/espace    | Sélecteur en haut de la barre latérale     |
| Passer en thème clair       | Bouton ☾ / ☀ en haut à droite              |
| Voir le détail d'une alerte | Cliquer la ligne d'alerte (Vue d'ensemble) |
| Voir le détail d'un outil   | Cliquer une carte dans _Projets & Outils_  |
| Fermer un panneau de détail | Touche **Échap** ou clic en dehors         |

## 5. Besoin d'aide ?

- Documentation technique → [Guide](/guide/getting-started)
- Un bug ou une idée → ouvrez une _issue_ sur le dépôt GitHub (gabarits fournis).

Bonne navigation ! 🌿
