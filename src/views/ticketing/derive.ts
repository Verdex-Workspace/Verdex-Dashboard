import type { GanttTask, RoadmapItem, StatusKind, Ticket, TicketSize } from '@/types'

/**
 * Dérivation des visualisations Roadmap & Gantt à partir des tickets réels
 * (deadlines, milestones, sprints) — fini les données mock décoratives.
 * Fonctions pures, testées unitairement.
 */

function parseDate(iso: string): Date {
  return new Date(iso + 'T00:00:00')
}

/** Index absolu mois (année*12 + mois) pour ordonner/comparer des deadlines. */
function monthIndex(d: Date): number {
  return d.getFullYear() * 12 + d.getMonth()
}

// --- Roadmap : une barre par milestone, étalée sur la plage de ses deadlines ---

export interface DerivedRoadmap {
  items: RoadmapItem[]
  months: string[]
}

export function deriveRoadmap(tickets: Ticket[], today: Date = new Date()): DerivedRoadmap {
  const dated = tickets.filter((t) => t.deadline)
  if (!dated.length) return { items: [], months: [] }

  const indices = dated.map((t) => monthIndex(parseDate(t.deadline as string)))
  const min = Math.min(...indices)
  const max = Math.max(...indices)
  const multiYear = Math.floor(max / 12) !== Math.floor(min / 12)

  const months: string[] = []
  for (let i = min; i <= max; i++) {
    const date = new Date(Math.floor(i / 12), i % 12, 1)
    const label = date.toLocaleDateString('fr-FR', {
      month: 'short',
      ...(multiYear ? { year: '2-digit' } : {}),
    })
    months.push(label)
  }

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const byMilestone = new Map<string, Ticket[]>()
  for (const t of dated) {
    if (!t.milestone) continue
    const group = byMilestone.get(t.milestone) ?? []
    group.push(t)
    byMilestone.set(t.milestone, group)
  }

  const items: RoadmapItem[] = []
  for (const [milestone, group] of byMilestone) {
    const gIdx = group.map((t) => monthIndex(parseDate(t.deadline as string)))
    const start = Math.min(...gIdx) - min
    const span = Math.max(...gIdx) - Math.min(...gIdx) + 1
    const allDone = group.every((t) => t.status === 'done')
    const overdue = group.some(
      (t) => t.status !== 'done' && parseDate(t.deadline as string) < todayStart,
    )
    const inProgress = group.some((t) => t.status === 'in_progress' || t.status === 'review')
    const kind: StatusKind = allDone ? 'ok' : overdue ? 'err' : inProgress ? 'info' : 'warn'
    items.push({ id: `ms-${milestone}`, label: milestone, startMonth: start, span, kind })
  }

  items.sort((a, b) => a.startMonth - b.startMonth || a.label.localeCompare(b.label))
  return { items, months }
}

// --- Gantt : une barre par ticket, placée sur son sprint, largeur ~ size ---

export interface DerivedGantt {
  tasks: GanttTask[]
  weeks: string[]
}

const SIZE_SPAN: Record<TicketSize, number> = { XS: 1, S: 1, M: 1, L: 2, XL: 3 }

function truncate(label: string, max = 30): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

export function deriveGantt(tickets: Ticket[]): DerivedGantt {
  const sprinted = tickets.filter((t) => t.sprint)
  const weeks = [...new Set(sprinted.map((t) => t.sprint as string))].sort((a, b) =>
    a.localeCompare(b),
  )
  if (!weeks.length) return { tasks: [], weeks: [] }

  const tasks: GanttTask[] = sprinted.map((t) => {
    const startWeek = weeks.indexOf(t.sprint as string)
    const wanted = t.size ? SIZE_SPAN[t.size] : 1
    const span = Math.min(wanted, weeks.length - startWeek)
    return {
      id: t.id,
      label: truncate(`#${t.ref} ${t.title}`),
      startWeek,
      span,
      critical: t.priority === 'P1',
    }
  })

  tasks.sort((a, b) => a.startWeek - b.startWeek || a.label.localeCompare(b.label))
  return { tasks, weeks }
}
