import { describe, expect, it } from 'vitest'
import { fetchTicketing, priorityScore } from '@/services/ticketing.service'

describe('ticketing.service', () => {
  it('renvoie tickets, assignés, roadmap, gantt et axes', async () => {
    const data = await fetchTicketing('me')
    expect(data.tickets.length).toBeGreaterThan(0)
    expect(data.assignees.length).toBeGreaterThan(0)
    expect(data.roadmap.length).toBeGreaterThan(0)
    expect(data.gantt.length).toBeGreaterThan(0)
    expect(data.months.length).toBeGreaterThan(0)
    expect(data.weeks.length).toBeGreaterThan(0)
  })

  it('chaque ticket a un statut et une priorité valides', async () => {
    const { tickets } = await fetchTicketing('me')
    for (const t of tickets) {
      expect(['backlog', 'todo', 'in_progress', 'review', 'done']).toContain(t.status)
      expect(['P1', 'P2', 'P3']).toContain(t.priority)
    }
  })

  it('priorityScore = impact ÷ effort (arrondi)', () => {
    expect(priorityScore({ impact: 90, effort: 5 })).toBe(18)
    expect(priorityScore({ impact: 60, effort: 0 })).toBe(60)
  })
})
