/**
 * Convention de commits — Conventional Commits.
 * Types autorisés alignés sur le workflow release-please / changelog Verdex.
 * @see https://www.conventionalcommits.org/
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // nouvelle fonctionnalité
        'fix', // correction de bug
        'docs', // documentation uniquement
        'style', // formatage (sans impact logique)
        'refactor', // refactorisation
        'perf', // amélioration de performance
        'test', // ajout/correction de tests
        'build', // système de build ou dépendances
        'ci', // configuration CI/CD
        'chore', // tâches diverses (maintenance)
        'revert', // annulation d'un commit
      ],
    ],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
}
