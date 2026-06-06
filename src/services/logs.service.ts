import type { LogsData } from '@/types'
import { LOGS_CHARTS, LOGS_KPIS, LOG_ENTRIES, LOG_SOURCES } from '@/data/mock/logs'

/**
 * Service du module Logs & Métriques.
 *
 * Aujourd'hui : données mock. Demain : remplacer le corps par des requêtes
 * Prometheus (PromQL) / Loki (LogQL) / Grafana, sans changer le contrat.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchLogs(_clientId: string): Promise<LogsData> {
  return delay({
    sources: LOG_SOURCES,
    kpis: LOGS_KPIS,
    charts: LOGS_CHARTS,
    entries: LOG_ENTRIES,
  })
}
