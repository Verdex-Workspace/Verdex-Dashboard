import type { ActivityEntry, Alert, AutomationRun, Kpi, Ticket } from '@/types'

/** Données mock de la Vue d'ensemble (remplacées plus tard par Supabase/connecteurs). */

export const OVERVIEW_KPIS: Kpi[] = [
  { key: 'Outils en ligne', value: '9 / 11', kind: 'ok', spark: true },
  { key: 'Alertes actives', value: '3', kind: 'warn' },
  { key: 'Tickets urgents', value: '5', kind: 'warn' },
  { key: 'Automations KO (24h)', value: '2', kind: 'err' },
  { key: 'Uptime moyen', value: '99.4%', kind: 'ok', spark: true },
]

export const OVERVIEW_ALERTS: Alert[] = [
  {
    id: 'a1',
    kind: 'err',
    source: 'Traefik',
    message: '502 sur api-novaweb',
    age: 'il y a 4 min',
  },
  {
    id: 'a2',
    kind: 'warn',
    source: 'PostgreSQL',
    message: 'connexions 86%',
    age: '12 min',
  },
  {
    id: 'a3',
    kind: 'warn',
    source: 'Proton Drive',
    message: 'quota 78%',
    age: '1 h',
  },
]

export const OVERVIEW_AUTOMATIONS: AutomationRun[] = [
  { id: 'f1', name: 'Sync CRM → Sheets', engine: 'n8n', status: 'err', last: 'exit 1 · timeout' },
  { id: 'f2', name: 'Relance factures', engine: 'make', status: 'err', last: 'auth expirée' },
]

export const OVERVIEW_TICKETS: Ticket[] = [
  { id: 't1', title: 'Fuite mémoire worker', priority: 'P1', age: '2j' },
  { id: 't2', title: 'Export CSV lent', priority: 'P2', age: '2j' },
  { id: 't3', title: 'Rate-limit API', priority: 'P2', age: '2j' },
]

export const OVERVIEW_ACTIVITY: ActivityEntry[] = [
  { id: 'e1', label: 'push · novaweb-api' },
  { id: 'e2', label: 'deploy · vercel prod' },
  { id: 'e3', label: 'PR #214 mergée' },
  { id: 'e4', label: 'release v1.4.0' },
]
