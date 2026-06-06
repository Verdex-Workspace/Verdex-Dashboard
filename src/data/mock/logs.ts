import type { Kpi, LogEntry, MetricChart } from '@/types'

/** Données mock du module Logs & Métriques (remplacées plus tard par les connecteurs). */

export const LOG_SOURCES = [
  'Grafana',
  'Prometheus',
  'Loki',
  'Traefik',
  'Docker',
  'API dev',
  'Vercel',
  'Supabase',
  'PostgreSQL',
  'Zabbix',
  'GitHub Actions',
]

export const LOGS_KPIS: Kpi[] = [
  { key: 'Logs / s', value: '12.4k', kind: 'ok', spark: true },
  { key: "Taux d'erreur", value: '1.8%', kind: 'warn', spark: true },
  { key: 'P95 latence API', value: '240ms', kind: 'ok', spark: true },
  { key: 'Alertes Prometheus', value: '3', kind: 'warn' },
]

export const LOGS_CHARTS: MetricChart[] = [
  { key: 'Requêtes / s', source: 'Prometheus', healthy: true },
  { key: 'Erreurs 5xx', source: 'Traefik', healthy: false },
  { key: 'CPU conteneurs', source: 'Docker', healthy: true },
]

export const LOG_ENTRIES: LogEntry[] = [
  {
    id: 'l1',
    time: '12:04:14',
    level: 'ERROR',
    source: 'Traefik',
    message: '502 upstream api-novaweb:4012',
  },
  {
    id: 'l2',
    time: '12:04:11',
    level: 'WARN',
    source: 'PostgreSQL',
    message: 'connections 86/100',
  },
  { id: 'l3', time: '12:04:09', level: 'INFO', source: 'Vercel', message: 'deployment ready prod' },
  {
    id: 'l4',
    time: '12:04:03',
    level: 'INFO',
    source: 'Docker',
    message: 'container billing restarted',
  },
  {
    id: 'l5',
    time: '12:03:58',
    level: 'DEBUG',
    source: 'API dev',
    message: 'GET /reports 200 180ms',
  },
  { id: 'l6', time: '12:03:52', level: 'WARN', source: 'Zabbix', message: 'disk /var 81%' },
  {
    id: 'l7',
    time: '12:03:47',
    level: 'ERROR',
    source: 'GitHub Actions',
    message: 'job build failed step 4',
  },
  { id: 'l8', time: '12:03:40', level: 'INFO', source: 'Loki', message: 'ingest 12k lines/s' },
  {
    id: 'l9',
    time: '12:03:33',
    level: 'INFO',
    source: 'Prometheus',
    message: 'scrape ok · 142 targets',
  },
  {
    id: 'l10',
    time: '12:03:21',
    level: 'DEBUG',
    source: 'Supabase',
    message: 'auth token refreshed',
  },
]
