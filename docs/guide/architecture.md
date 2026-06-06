# Architecture

## Vue d'ensemble

Le Verdex Dashboard est une **SPA Vue 3** organisée par responsabilités. La
donnée transite par une **couche de services** qui isole l'UI de sa source —
aujourd'hui des données mock, demain Supabase et des connecteurs (Prometheus,
Loki, n8n…).

```
┌─────────────────────────────────────────────┐
│                  Vues (modules)              │  src/views
│  Overview · Projects · Logs · Ticketing …    │
└───────────────┬─────────────────────────────┘
                │ utilise
┌───────────────▼───────────┐  ┌────────────────┐
│  Composants UI (design DS) │  │  Stores Pinia   │
│  src/components/ui + layout │  │  theme · ui …   │
└───────────────┬───────────┘  └────────────────┘
                │ appelle
┌───────────────▼─────────────────────────────┐
│              Services (abstraction)          │  src/services
│   fetchOverview() → mock | Supabase | API    │
└───────────────┬─────────────────────────────┘
                │ lit
┌───────────────▼─────────────────────────────┐
│           Données (mock) / Supabase           │  src/data
└─────────────────────────────────────────────┘
```

## Arborescence

```
src/
├─ assets/styles/    # tokens, primitives et shell (CSS)
├─ components/
│  ├─ ui/            # primitives du design system (VFrame, VChip, VKpi…)
│  └─ layout/        # AppSidebar, AppTopBar, SlideOver
├─ composables/      # logique réutilisable (à venir)
├─ data/             # navigation + données mock typées
├─ services/         # accès aux données (contrat stable)
├─ stores/           # Pinia : theme, ui, detail
├─ types/            # types partagés
├─ router/           # routes des 9 modules (lazy-loaded)
└─ views/            # une vue par module
```

## Principes

- **Le design system d'abord.** Les vues composent des primitives (`VFrame`,
  `VBox`, `VChip`, `VKpi`, `VSpark`, `VTabs`…) plutôt que du HTML/CSS ad hoc.
- **Tokens, pas de couleurs en dur.** Tout passe par les variables CSS
  (`--accent`, `--paper`, `--muted`…) pour que le thème sombre/clair fonctionne.
- **Services = frontière de données.** Changer la source (mock → Supabase) ne
  doit pas toucher aux vues : seul le corps des fonctions de `src/services`
  change.
- **Routing par module.** Chaque module est une route nommée (le `name`
  correspond à l'`id` de navigation, ce qui pilote le surlignage et le fil
  d'Ariane).

## State (Pinia)

| Store    | Rôle                                                      |
| -------- | --------------------------------------------------------- |
| `theme`  | Thème sombre/clair, persistance, application sur `<html>` |
| `ui`     | Client/espace actif, état de la sidebar mobile            |
| `detail` | Panneau de détail glissant (slide-over) global            |

## Tests

- **Unitaires / composants** : Vitest + Vue Test Utils (`tests/unit`,
  `tests/component`). Couverture ciblée sur la logique réutilisable (UI, stores,
  services, data), seuil **60 %**.
- **End-to-end** : Playwright (`tests/e2e`) couvre le shell et la navigation.
