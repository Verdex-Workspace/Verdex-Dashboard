import type { Ticket, TicketingData } from '@/types'
import { ASSIGNEES, GANTT, MONTHS, ROADMAP, TICKETS, WEEKS } from '@/data/mock/ticketing'

/**
 * Service du module Ticketing.
 *
 * Aujourd'hui : données mock. Demain : remplacer par Supabase (table tickets +
 * relations) et, à terme, synchronisation des deadlines vers Proton Calendar.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchTicketing(_clientId: string): Promise<TicketingData> {
  return delay({
    // copie défensive : la vue peut muter sa propre liste (création de ticket)
    tickets: TICKETS.map((t) => ({ ...t })),
    assignees: ASSIGNEES,
    roadmap: ROADMAP,
    gantt: GANTT,
    months: MONTHS,
    weeks: WEEKS,
  })
}

/** Score de priorisation = impact ÷ effort (recalculé dans la matrice). */
export function priorityScore(ticket: Pick<Ticket, 'impact' | 'effort'>): number {
  if (ticket.effort <= 0) return ticket.impact
  return Math.round(ticket.impact / ticket.effort)
}
