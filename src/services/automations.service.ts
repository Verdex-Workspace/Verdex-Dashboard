import type { AutomationsData } from '@/types'
import { WORKFLOWS } from '@/data/mock/automations'

/**
 * Service du module Automations.
 *
 * Aujourd'hui : données mock. Demain : remplacer par les API n8n / Make /
 * Zapier (liste des workflows, exécutions, relance) sans changer le contrat.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchAutomations(_clientId: string): Promise<AutomationsData> {
  return delay({ workflows: WORKFLOWS })
}
