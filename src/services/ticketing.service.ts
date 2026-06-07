import type {
  Label,
  LinkedRef,
  Ticket,
  TicketingData,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '@/types'
import { ASSIGNEES, GANTT, MONTHS, ROADMAP, TICKETS, WEEKS } from '@/data/mock/ticketing'
import { supabase } from '@/lib/supabase'

/**
 * Service du module Ticketing.
 *
 * - Supabase configuré → table `tickets` (lecture/écriture, RLS).
 * - Sinon (démo/CI) → données mock.
 * Les visualisations roadmap/gantt et la liste des assignés restent mock pour
 * l'instant (données dérivées / statiques).
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const STATIC = {
  assignees: ASSIGNEES,
  roadmap: ROADMAP,
  gantt: GANTT,
  months: MONTHS,
  weeks: WEEKS,
}

interface TicketRow {
  id: string
  ref: number
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  effort: number
  impact: number
  tool_id: string | null
  client_id: string
  assignee_id: string | null
  labels: Label[]
  deadline: string | null
  sprint: string | null
  linked_prs: LinkedRef[]
  linked_issues: LinkedRef[]
  created_at: string
  updated_at: string
}

function rowToTicket(r: TicketRow): Ticket {
  return {
    id: r.id,
    ref: r.ref,
    title: r.title,
    description: r.description,
    type: r.type,
    priority: r.priority,
    status: r.status,
    effort: r.effort,
    impact: r.impact,
    toolId: r.tool_id,
    clientId: r.client_id,
    assigneeId: r.assignee_id,
    labels: r.labels ?? [],
    deadline: r.deadline,
    sprint: r.sprint,
    linkedPrs: r.linked_prs ?? [],
    linkedIssues: r.linked_issues ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function fetchTicketing(_clientId: string): Promise<TicketingData> {
  if (!supabase) {
    return delay({ tickets: TICKETS.map((t) => ({ ...t })), ...STATIC })
  }
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('ref', { ascending: false })
  // Erreur réseau → repli mock ; succès (même vide) → données réelles.
  if (error || !data) return { tickets: TICKETS.map((t) => ({ ...t })), ...STATIC }
  return { tickets: (data as TicketRow[]).map(rowToTicket), ...STATIC }
}

export interface NewTicket {
  title: string
  description?: string
  type: TicketType
  priority: TicketPriority
  status?: TicketStatus
  effort?: number
  impact?: number
  toolId?: string | null
  clientId?: string
  assigneeId?: string | null
  labels?: Label[]
  deadline?: string | null
  sprint?: string | null
}

export async function createTicket(input: NewTicket): Promise<Ticket> {
  if (!supabase) throw new Error('Supabase non configuré')
  const row = {
    title: input.title,
    description: input.description ?? '',
    type: input.type,
    priority: input.priority,
    status: input.status ?? 'backlog',
    effort: input.effort ?? 0,
    impact: input.impact ?? 0,
    tool_id: input.toolId ?? null,
    client_id: input.clientId ?? 'me',
    assignee_id: input.assigneeId ?? null,
    labels: input.labels ?? [],
    deadline: input.deadline ?? null,
    sprint: input.sprint ?? null,
    linked_prs: [],
    linked_issues: [],
  }
  const { data, error } = await supabase.from('tickets').insert(row).select().single()
  if (error || !data) throw error ?? new Error('insertion échouée')
  return rowToTicket(data as TicketRow)
}

export async function deleteTicket(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('tickets').delete().eq('id', id)
  if (error) throw error
}

/** Met à jour partiellement un ticket (statut, liens PR/issues). */
export async function updateTicket(
  id: string,
  patch: { status?: TicketStatus; linkedIssues?: LinkedRef[]; linkedPrs?: LinkedRef[] },
): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.status) row.status = patch.status
  if (patch.linkedIssues) row.linked_issues = patch.linkedIssues
  if (patch.linkedPrs) row.linked_prs = patch.linkedPrs
  const { error } = await supabase.from('tickets').update(row).eq('id', id)
  if (error) throw error
}

/** Score de priorisation = impact ÷ effort (recalculé dans la matrice). */
export function priorityScore(ticket: Pick<Ticket, 'impact' | 'effort'>): number {
  if (ticket.effort <= 0) return ticket.impact
  return Math.round(ticket.impact / ticket.effort)
}
