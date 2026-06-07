import type {
  Label,
  StatusKind,
  TicketPriority,
  TicketSize,
  TicketStatus,
  TicketType,
} from '@/types'

/** Correspondances de couleurs/labels partagées par les vues du Ticketing. */

/** Catalogue de labels proposés (source unique pour la sélection guidée + le mock). */
export const LABEL_CATALOG: Label[] = [
  { id: 'backend', name: 'backend', kind: 'info' },
  { id: 'frontend', name: 'frontend', kind: 'info' },
  { id: 'security', name: 'sécurité', kind: 'err' },
  { id: 'infra', name: 'infra', kind: 'warn' },
  { id: 'perf', name: 'perf', kind: 'warn' },
  { id: 'ux', name: 'ux', kind: 'info' },
]

/** Tailles disponibles (single-select façon GitHub Projects). */
export const SIZES: TicketSize[] = ['XS', 'S', 'M', 'L', 'XL']

export const TYPE_KIND: Record<TicketType, StatusKind> = {
  bug: 'err',
  perf: 'warn',
  feature: 'info',
  chore: 'neutral',
}

export const TYPE_LABEL: Record<TicketType, string> = {
  bug: 'bug',
  perf: 'perf',
  feature: 'feature',
  chore: 'chore',
}

export const PRIORITY_KIND: Record<TicketPriority, StatusKind> = {
  P1: 'err',
  P2: 'warn',
  P3: 'neutral',
}

export interface ColumnDef {
  id: TicketStatus
  label: string
}

export const STATUS_COLUMNS: ColumnDef[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'À faire' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Fait' },
]

export const STATUS_LABEL: Record<TicketStatus, string> = {
  backlog: 'Backlog',
  todo: 'À faire',
  in_progress: 'En cours',
  review: 'Review',
  done: 'Fait',
}

const KIND_VAR: Record<StatusKind, string> = {
  ok: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
  info: 'var(--info)',
  neutral: 'var(--muted)',
}

export function kindColor(kind: StatusKind): string {
  return KIND_VAR[kind]
}

/** Formate une deadline ISO en libellé court + indicateur d'urgence. */
export function formatDeadline(
  iso: string | null,
  today = new Date(),
): { label: string; kind: StatusKind } | null {
  if (!iso) return null
  const date = new Date(iso + 'T00:00:00')
  const days = Math.round((date.getTime() - today.getTime()) / 86_400_000)
  const label = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  let kind: StatusKind = 'neutral'
  if (days < 0) kind = 'err'
  else if (days <= 3) kind = 'warn'
  else if (days <= 7) kind = 'info'
  return { label, kind }
}
