# Design system Verdex

Le design system vit dans `src/assets/styles/` (tokens + primitives) et
`src/components/ui/` (composants Vue).

## Tokens de couleur

Tout est piloté par des variables CSS, déclinées en thème sombre (défaut) et
clair (`[data-theme="light"]`).

| Token      | Sombre    | Rôle                      |
| ---------- | --------- | ------------------------- |
| `--bg`     | `#0b1310` | Fond de l'application     |
| `--paper`  | `#0f1815` | Surfaces / cartes         |
| `--ink`    | `#d9e7df` | Texte principal           |
| `--muted`  | `#7e9088` | Texte secondaire          |
| `--line`   | `#39483f` | Bordures                  |
| `--accent` | `#2ee59d` | **Vert Verdex** (actions) |
| `--warn`   | `#f0b84a` | Avertissement             |
| `--err`    | `#f0766a` | Erreur / critique         |
| `--info`   | `#6db5f0` | Information               |

> **Règle d'or :** n'utilisez jamais de couleur en dur. Référez-vous aux tokens
> pour garantir la cohérence et le bon fonctionnement du thème clair/sombre.

## Typographie

- **Space Grotesk** — texte courant et titres.
- **Space Mono** — valeurs, codes, métadonnées (classe `.mono`).

## Primitives (composants UI)

Importables depuis `@/components/ui` :

| Composant      | Usage                                          |
| -------------- | ---------------------------------------------- |
| `VFrame`       | Cadre avec légende/tag ou barre de fenêtre     |
| `VBox`         | Boîte (variantes `plain`, `dash`, `clickable`) |
| `VChip`        | Étiquette de statut (`ok`/`warn`/`err`/`info`) |
| `VKpi`         | Carte d'indicateur clé (+ sparkline optionnel) |
| `VSpark`       | Mini graphe à barres déterministe              |
| `VTabs`        | Onglets segmentés (`v-model`)                  |
| `VButton`      | Bouton (`primary`)                             |
| `VBar`/`VBars` | Barres placeholder (squelettes)                |
| `VIconBox`     | Conteneur d'icône carré                        |
| `VSheetHeader` | En-tête de page (badge + titre + description)  |

### Exemple

```vue
<script setup lang="ts">
import { VFrame, VKpi, VChip } from '@/components/ui'
</script>

<template>
  <VFrame cap="Santé" tag="live">
    <VKpi label="Uptime moyen" value="99.4%" kind="ok" spark />
    <VChip kind="warn">à voir</VChip>
  </VFrame>
</template>
```

## Shell applicatif

Le shell (sidebar libellée groupée, top bar avec fil d'Ariane et bascule de
thème, sélecteur multi-clients, slide-over) est défini dans
`src/components/layout/` et stylé dans `src/assets/styles/shell.css`.
