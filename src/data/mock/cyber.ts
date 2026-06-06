import type { AuditCheck, AuditScore, AuditSource, Vulnerability } from '@/types'

/** Données mock du module Cybersécurité (remplacées plus tard par l'audit réel). */

export const AUDIT_SOURCES: AuditSource[] = [
  { id: 's1', name: 'infra-prod.pdf', status: 'ok', statusLabel: 'indexé' },
  { id: 's2', name: 'docker-compose.yml', status: 'ok', statusLabel: 'indexé' },
  { id: 's3', name: 'nginx.conf', status: 'ok', statusLabel: 'indexé' },
  { id: 's4', name: 'audit-2024.pdf', status: 'ok', statusLabel: 'indexé' },
  { id: 's5', name: 'accès SSH (clés)', status: 'warn', statusLabel: 'sensible' },
]

export const AUDIT_QUESTIONS: string[] = [
  'Quels ports sont exposés publiquement ?',
  'Y a-t-il des secrets en clair dans le dépôt ?',
  "Quelle est la surface d'attaque exposée ?",
  'Quelles versions sont obsolètes (CVE) ?',
]

export const AUDIT_CHECKS: AuditCheck[] = [
  { id: 'c1', label: 'Exposition réseau & ports', enabled: true },
  { id: 'c2', label: 'Secrets & configuration', enabled: true },
  { id: 'c3', label: 'Dépendances (CVE)', enabled: true },
  { id: 'c4', label: 'Durcissement Docker', enabled: true },
  { id: 'c5', label: 'TLS / certificats', enabled: false },
]

export const AUDIT_SCORES: AuditScore[] = [
  { key: 'Score sécurité', value: '72 / 100', kind: 'warn' },
  { key: 'Critiques', value: '2', kind: 'err' },
  { key: 'Élevées', value: '5', kind: 'warn' },
  { key: 'Moyennes', value: '11', kind: 'info' },
  { key: 'Conformité', value: 'ANSSI 78%', kind: 'ok' },
]

export const VULNERABILITIES: Vulnerability[] = [
  {
    id: 'v1',
    severity: 'err',
    severityLabel: 'critique',
    cvss: '9.1',
    finding: 'Port PostgreSQL 5432 exposé publiquement',
    component: 'db-prod',
    why: "La base de données est accessible depuis Internet : toute fuite d'identifiants ou faille du moteur expose directement l'intégralité des données.",
    how: "Restreindre 5432 au réseau interne, le placer derrière Traefik, et n'autoriser que les IP applicatives via pare-feu.",
    benefits: ['surface −40%', 'conformité +12 pts'],
  },
  {
    id: 'v2',
    severity: 'err',
    severityLabel: 'critique',
    cvss: '8.8',
    finding: 'Secret API en clair dans un .env commité',
    component: 'billing',
    why: "Un secret présent dans l'historique Git reste exploitable même après suppression : il peut servir à usurper le service.",
    how: 'Révoquer la clé, la régénérer, la stocker dans un coffre (Vercel env / secret manager) et purger l’historique.',
    benefits: ['secret révoqué', 'rotation auto'],
  },
  {
    id: 'v3',
    severity: 'warn',
    severityLabel: 'élevée',
    cvss: '7.2',
    finding: 'Image Docker de base obsolète (CVE-2024-x)',
    component: 'novaweb-api',
    why: "L'image de base contient des paquets vulnérables connus, exploitables pour une élévation de privilèges.",
    how: 'Mettre à jour vers une image patchée (alpine récente), activer le scan d’images dans la CI.',
    benefits: ['CVE corrigées', 'scan CI'],
  },
  {
    id: 'v4',
    severity: 'warn',
    severityLabel: 'élevée',
    cvss: '6.5',
    finding: 'TLS 1.0 encore accepté',
    component: 'traefik',
    why: 'TLS 1.0 est déprécié et vulnérable (BEAST/POODLE) : un attaquant peut tenter un downgrade.',
    how: 'Imposer TLS 1.2+ dans la configuration Traefik et désactiver les suites faibles.',
    benefits: ['downgrade bloqué', 'conformité +5 pts'],
  },
  {
    id: 'v5',
    severity: 'info',
    severityLabel: 'moyenne',
    cvss: '5.0',
    finding: 'En-têtes de sécurité manquants (CSP)',
    component: 'atelier-front',
    why: "L'absence de Content-Security-Policy facilite les attaques XSS et l'injection de contenu.",
    how: 'Ajouter CSP, X-Frame-Options, HSTS et Referrer-Policy au niveau du reverse-proxy.',
    benefits: ['XSS mitigé', 'headers A+'],
  },
]
