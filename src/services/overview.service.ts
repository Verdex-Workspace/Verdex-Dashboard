import type { ActivityEntry, Alert, AutomationRun, Kpi, UrgentTicket } from '@/types'
import {
  OVERVIEW_ACTIVITY,
  OVERVIEW_ALERTS,
  OVERVIEW_AUTOMATIONS,
  OVERVIEW_KPIS,
  OVERVIEW_TICKETS,
} from '@/data/mock/overview'

/**
 * Service de la Vue d'ensemble.
 *
 * Aujourd'hui : renvoie des données mock.
 * Demain : remplacer le corps de ces fonctions par des appels Supabase /
 * connecteurs (Prometheus, Loki, n8n…), sans changer le contrat exposé.
 */
export interface OverviewData {
  kpis: Kpi[]
  alerts: Alert[]
  automations: AutomationRun[]
  tickets: UrgentTicket[]
  activity: ActivityEntry[]
}

/** Simule une latence réseau pour un rendu réaliste des états de chargement. */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchOverview(_clientId: string): Promise<OverviewData> {
  // _clientId servira à filtrer par espace une fois Supabase branché.
  return delay({
    kpis: OVERVIEW_KPIS,
    alerts: OVERVIEW_ALERTS,
    automations: OVERVIEW_AUTOMATIONS,
    tickets: OVERVIEW_TICKETS,
    activity: OVERVIEW_ACTIVITY,
  })
}
