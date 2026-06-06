import type { Tool, ToolDetail } from '@/types'

/** Données mock du module Projets & Outils (remplacées plus tard par Supabase). */

export const TOOLS: Tool[] = [
  {
    id: 'novaweb',
    name: 'novaweb-api',
    env: 'prod',
    status: 'ok',
    version: '1.4.0',
    stack: 'Node · Fastify',
    icon: '▤',
    openPrs: 4,
    openIssues: 7,
  },
  {
    id: 'atelier',
    name: 'atelier-front',
    env: 'prod',
    status: 'ok',
    version: '2.1.3',
    stack: 'Next.js',
    icon: '◳',
    openPrs: 2,
    openIssues: 3,
  },
  {
    id: 'billing',
    name: 'billing-service',
    env: 'staging',
    status: 'warn',
    version: '0.9.2',
    stack: 'NestJS',
    icon: '◰',
    openPrs: 5,
    openIssues: 9,
  },
  {
    id: 'dashboard',
    name: 'verdex-dashboard',
    env: 'dev',
    status: 'ok',
    version: '0.1.0',
    stack: 'Vue · Vite',
    icon: '◎',
    openPrs: 1,
    openIssues: 2,
  },
  {
    id: 'scraper',
    name: 'data-scraper',
    env: 'prod',
    status: 'err',
    version: '1.0.7',
    stack: 'Python',
    icon: '≣',
    openPrs: 0,
    openIssues: 5,
  },
  {
    id: 'auth',
    name: 'auth-gateway',
    env: 'prod',
    status: 'ok',
    version: '3.2.0',
    stack: 'Go',
    icon: '⛨',
    openPrs: 3,
    openIssues: 1,
  },
]

export const TOOL_DETAILS: Record<string, ToolDetail> = {
  novaweb: {
    id: 'novaweb',
    port: 4012,
    description:
      'API principale de NovaWeb : exposition REST, agrégation des données et orchestration des intégrations tierces.',
    metrics: [
      { key: 'Uptime 30j', value: '99.6%', kind: 'ok' },
      { key: 'P95 latence', value: '180ms', kind: 'ok' },
      { key: 'Erreurs 24h', value: '0.2%', kind: 'ok' },
    ],
    dependencies: [
      { name: 'fastify ^4', upToDate: true },
      { name: 'pg ^8', upToDate: true },
      { name: 'zod ^3', upToDate: true },
      { name: 'pino ^9', upToDate: true },
    ],
    links: [
      { label: '↗ Repo GitHub', url: '#' },
      { label: '↗ Vercel', url: '#' },
      { label: '↗ Supabase', url: '#' },
      { label: '↗ Grafana dashboard', url: '#' },
    ],
    commits: [
      { hash: 'a1f9c2', message: 'feat: cache redis sur /reports', age: '2 h' },
      { hash: '7d3e10', message: 'fix: timeout pg pool', age: '5 h' },
      { hash: '4b8a91', message: 'chore: bump deps', age: '1 j' },
      { hash: '9c2f55', message: 'refactor: split routes', age: '2 j' },
    ],
    pullRequests: [
      { id: '214', title: 'Cache des rapports', status: 'ok', detail: 'mergeable · 2 review' },
      { id: '212', title: 'Migration pg 16', status: 'warn', detail: 'conflits' },
      { id: '209', title: 'Rate-limit API', status: 'ok', detail: 'en review' },
    ],
    issues: [
      { id: 'i1', kind: 'err', title: 'Fuite mémoire worker', meta: 'bug · P1' },
      { id: 'i2', kind: 'warn', title: 'Export CSV lent', meta: 'perf · P2' },
      { id: 'i3', kind: 'info', title: 'Ajouter webhook Stripe', meta: 'feat' },
    ],
    deployments: [
      { env: 'prod', version: '1.4.0', when: 'Vercel · il y a 2 h', status: 'ok' },
      { env: 'staging', version: '1.4.1-rc', when: 'il y a 20 min', status: 'warn' },
      { env: 'prod', version: '1.3.9', when: 'hier', status: 'ok' },
    ],
  },
  atelier: {
    id: 'atelier',
    port: 3000,
    description:
      "Front-office d'Atelier Mauve : vitrine et espace client, rendu Next.js sur Vercel.",
    metrics: [
      { key: 'LCP', value: '1.2s', kind: 'warn' },
      { key: 'INP', value: '180ms', kind: 'ok' },
      { key: 'Erreurs 24h', value: '0.0%', kind: 'ok' },
    ],
    dependencies: [
      { name: 'next ^15', upToDate: true },
      { name: 'react ^19', upToDate: true },
      { name: 'tailwindcss ^4', upToDate: true },
    ],
    links: [
      { label: '↗ Repo GitHub', url: '#' },
      { label: '↗ Vercel', url: '#' },
    ],
    commits: [
      { hash: 'c3a7e1', message: 'feat: page tarifs', age: '3 h' },
      { hash: 'b91d04', message: 'fix: CLS hero mobile', age: '1 j' },
    ],
    pullRequests: [
      { id: '88', title: 'Refonte header', status: 'ok', detail: 'en review' },
      { id: '85', title: 'i18n FR/EN', status: 'ok', detail: 'mergeable' },
    ],
    issues: [
      { id: 'i1', kind: 'warn', title: 'Optimiser images hero', meta: 'perf · P2' },
      { id: 'i2', kind: 'info', title: 'Mode sombre', meta: 'feat' },
    ],
    deployments: [
      { env: 'prod', version: '2.1.3', when: 'Vercel · hier', status: 'ok' },
      { env: 'staging', version: '2.2.0-rc', when: 'il y a 1 h', status: 'ok' },
    ],
  },
  billing: {
    id: 'billing',
    port: 4020,
    description:
      'Service de facturation (NestJS) : abonnements, relances et webhooks Stripe. En cours de stabilisation.',
    metrics: [
      { key: 'Uptime 30j', value: '98.1%', kind: 'warn' },
      { key: 'P95 latence', value: '640ms', kind: 'warn' },
      { key: 'Erreurs 24h', value: '1.1%', kind: 'warn' },
    ],
    dependencies: [
      { name: '@nestjs/core ^11', upToDate: true },
      { name: 'stripe ^17', upToDate: false },
      { name: 'typeorm ^0.3', upToDate: true },
    ],
    links: [
      { label: '↗ Repo GitHub', url: '#' },
      { label: '↗ Stripe dashboard', url: '#' },
    ],
    commits: [
      { hash: 'e22b71', message: 'fix: retry webhooks Stripe', age: '1 h' },
      { hash: 'a07f3c', message: 'feat: relances J+7', age: '6 h' },
    ],
    pullRequests: [
      { id: '52', title: 'Migration TypeORM 0.3', status: 'warn', detail: 'conflits' },
      { id: '50', title: 'Idempotence webhooks', status: 'ok', detail: 'en review' },
    ],
    issues: [
      { id: 'i1', kind: 'err', title: 'Double facturation rare', meta: 'bug · P1' },
      { id: 'i2', kind: 'warn', title: 'Lenteur export comptable', meta: 'perf · P2' },
    ],
    deployments: [
      { env: 'staging', version: '0.9.2', when: 'il y a 30 min', status: 'warn' },
      { env: 'staging', version: '0.9.1', when: 'hier', status: 'ok' },
    ],
  },
  dashboard: {
    id: 'dashboard',
    port: 5173,
    description:
      'Le Verdex Dashboard lui-même : cockpit admin/DevOps/cybersécurité (Vue 3 + Vite + TypeScript).',
    metrics: [
      { key: 'Couverture', value: '90%', kind: 'ok' },
      { key: 'Bundle', value: '39 Ko', kind: 'ok' },
      { key: 'Build', value: '0.2s', kind: 'ok' },
    ],
    dependencies: [
      { name: 'vue ^3.5', upToDate: true },
      { name: 'vue-router ^5', upToDate: true },
      { name: 'pinia ^3', upToDate: true },
      { name: 'tailwindcss ^4', upToDate: true },
    ],
    links: [
      { label: '↗ Repo GitHub', url: 'https://github.com/Verdex-Workspace/Verdex-Dashboard' },
      { label: '↗ Documentation', url: '#' },
    ],
    commits: [
      { hash: '0b6194', message: 'feat: project foundation', age: '1 h' },
      { hash: '362937', message: 'test(e2e): déterminisme du thème', age: '1 h' },
    ],
    pullRequests: [{ id: '2', title: 'Module Projets & Outils', status: 'ok', detail: 'en cours' }],
    issues: [
      { id: 'i1', kind: 'info', title: 'Brancher Supabase', meta: 'feat · P2' },
      { id: 'i2', kind: 'info', title: 'Connecteur Loki', meta: 'feat · P3' },
    ],
    deployments: [{ env: 'dev', version: '0.1.0', when: 'local', status: 'ok' }],
  },
  scraper: {
    id: 'scraper',
    port: 8000,
    description:
      'Collecteur de données (Python) : extractions planifiées et normalisation. Incident en cours.',
    metrics: [
      { key: 'Uptime 30j', value: '94.2%', kind: 'err' },
      { key: 'Jobs KO 24h', value: '6', kind: 'err' },
      { key: 'Débit', value: '1.2k/s', kind: 'warn' },
    ],
    dependencies: [
      { name: 'httpx ^0.27', upToDate: true },
      { name: 'beautifulsoup4 ^4', upToDate: true },
      { name: 'celery ^5', upToDate: false },
    ],
    links: [{ label: '↗ Repo GitHub', url: '#' }],
    commits: [
      { hash: 'f01a2b', message: 'fix: gestion 429 upstream', age: '4 h' },
      { hash: 'd9c813', message: 'chore: rotate proxies', age: '2 j' },
    ],
    pullRequests: [],
    issues: [
      { id: 'i1', kind: 'err', title: 'Worker bloqué sur source X', meta: 'bug · P1' },
      { id: 'i2', kind: 'warn', title: 'Backoff insuffisant', meta: 'bug · P2' },
    ],
    deployments: [{ env: 'prod', version: '1.0.7', when: 'il y a 3 j', status: 'err' }],
  },
  auth: {
    id: 'auth',
    port: 4443,
    description: "Passerelle d'authentification (Go) : SSO, émission de tokens et rate-limiting.",
    metrics: [
      { key: 'Uptime 30j', value: '99.9%', kind: 'ok' },
      { key: 'P95 latence', value: '24ms', kind: 'ok' },
      { key: 'Erreurs 24h', value: '0.0%', kind: 'ok' },
    ],
    dependencies: [
      { name: 'go 1.23', upToDate: true },
      { name: 'chi ^5', upToDate: true },
      { name: 'jwx ^2', upToDate: true },
    ],
    links: [
      { label: '↗ Repo GitHub', url: '#' },
      { label: '↗ Grafana dashboard', url: '#' },
    ],
    commits: [
      { hash: '5ab9d0', message: 'feat: SSO Proton', age: '1 j' },
      { hash: '3c71f8', message: 'perf: cache JWKS', age: '3 j' },
    ],
    pullRequests: [
      { id: '120', title: 'Rotation des clés', status: 'ok', detail: 'mergeable' },
      { id: '118', title: 'Audit log', status: 'ok', detail: 'en review' },
    ],
    issues: [{ id: 'i1', kind: 'info', title: 'Support WebAuthn', meta: 'feat · P3' }],
    deployments: [
      { env: 'prod', version: '3.2.0', when: 'il y a 1 j', status: 'ok' },
      { env: 'prod', version: '3.1.4', when: 'la semaine dernière', status: 'ok' },
    ],
  },
}
