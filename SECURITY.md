# Politique de sécurité

## Signaler une vulnérabilité

Si vous découvrez une faille de sécurité dans le Verdex Dashboard :

- **Ne créez pas d'issue publique.**
- Contactez l'équipe en privé via les
  [Security Advisories GitHub](https://github.com/Verdex-Workspace/Verdex-Dashboard/security/advisories/new).

Nous nous engageons à accuser réception sous quelques jours ouvrés et à vous
tenir informé de la résolution.

## Bonnes pratiques du projet

- Aucun secret n'est committé : les variables sensibles vivent dans `.env.local`
  (ignoré) ou dans les variables d'environnement Vercel.
- Seules les variables `VITE_` (publiques) sont exposées au client.
- Les dépendances sont surveillées via Dependabot.
- Les services internes (Postgres, Prometheus, Loki…) ne doivent pas être
  exposés publiquement (voir la [checklist infrastructure](./docs/infra-setup.md)).
