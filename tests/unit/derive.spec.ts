import { describe, expect, it } from 'vitest'
import { deriveGantt, deriveRoadmap } from '@/views/ticketing/derive'
import type { Ticket } from '@/types'

function ticket(p: Partial<Ticket>): Ticket {
  return {
    id: p.id ?? 't1',
    ref: p.ref ?? 1,
    title: p.title ?? 'T',
    description: '',
    type: 'feature',
    priority: p.priority ?? 'P2',
    status: p.status ?? 'todo',
    effort: 0,
    impact: 0,
    toolId: null,
    clientId: 'me',
    assigneeId: null,
    labels: [],
    deadline: p.deadline ?? null,
    sprint: p.sprint ?? null,
    milestone: p.milestone ?? null,
    size: p.size ?? null,
    estimate: null,
    linkedPrs: [],
    linkedIssues: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  }
}

describe('deriveRoadmap', () => {
  it('groupe par milestone et calcule la plage de mois', () => {
    const tickets = [
      ticket({ id: 'a', milestone: 'v1', deadline: '2026-06-10', status: 'done' }),
      ticket({ id: 'b', milestone: 'v1', deadline: '2026-08-10', status: 'done' }),
      ticket({ id: 'c', milestone: 'v2', deadline: '2026-07-01', status: 'todo' }),
    ]
    const { items, months } = deriveRoadmap(tickets, new Date('2026-06-07T00:00:00'))
    expect(months).toHaveLength(3) // juin, juil, août
    const v1 = items.find((i) => i.label === 'v1')!
    expect(v1.startMonth).toBe(0)
    expect(v1.span).toBe(3)
    expect(v1.kind).toBe('ok') // tous done
  })

  it('marque un jalon en retard (err) si une deadline est passée et non done', () => {
    const tickets = [ticket({ milestone: 'v1', deadline: '2026-05-01', status: 'todo' })]
    const { items } = deriveRoadmap(tickets, new Date('2026-06-07T00:00:00'))
    expect(items[0].kind).toBe('err')
  })

  it('renvoie vide sans deadline', () => {
    expect(deriveRoadmap([ticket({ milestone: 'v1' })])).toEqual({ items: [], months: [] })
  })
})

describe('deriveGantt', () => {
  it('place les tickets sur leurs sprints, span selon size, P1 critique', () => {
    const tickets = [
      ticket({ id: 'a', ref: 1, sprint: 'S24', size: 'XL', priority: 'P1' }),
      ticket({ id: 'b', ref: 2, sprint: 'S25', size: 'S', priority: 'P2' }),
    ]
    const { tasks, weeks } = deriveGantt(tickets)
    expect(weeks).toEqual(['S24', 'S25'])
    const a = tasks.find((t) => t.id === 'a')!
    expect(a.startWeek).toBe(0)
    expect(a.span).toBe(2) // XL=3 borné à weeks.length - startWeek = 2
    expect(a.critical).toBe(true)
    const b = tasks.find((t) => t.id === 'b')!
    expect(b.span).toBe(1)
    expect(b.critical).toBe(false)
  })

  it('renvoie vide sans sprint', () => {
    expect(deriveGantt([ticket({})])).toEqual({ tasks: [], weeks: [] })
  })
})
