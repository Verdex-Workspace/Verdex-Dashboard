import type { Tool, ToolDetail } from '@/types'
import { TOOLS, TOOL_DETAILS } from '@/data/mock/projects'

/**
 * Service du module Projets & Outils.
 *
 * Aujourd'hui : données mock. Demain : remplacer le corps par des appels
 * Supabase / API GitHub sans changer le contrat exposé.
 */

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchTools(_clientId: string): Promise<Tool[]> {
  // _clientId servira à filtrer par espace une fois Supabase branché.
  return delay(TOOLS)
}

export async function fetchToolDetail(toolId: string): Promise<ToolDetail | null> {
  return delay(TOOL_DETAILS[toolId] ?? null)
}
