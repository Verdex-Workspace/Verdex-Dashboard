# Changelog

Toutes les évolutions notables de ce projet sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et le
versioning respecte [Semantic Versioning](https://semver.org/lang/fr/).
À partir de la première release, ce fichier est maintenu automatiquement par
**release-please** à partir des commits conventionnels.

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
