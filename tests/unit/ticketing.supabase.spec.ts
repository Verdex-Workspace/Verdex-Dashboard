import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/supabase', () => {
  const row = {
    id: 'u1',
    ref: 7,
    title: 'Ticket réel',
    description: 'desc',
    type: 'bug',
    priority: 'P1',
    status: 'todo',
    effort: 3,
    impact: 80,
    tool_id: null,
    client_id: 'me',
    assignee_id: null,
    labels: [],
    deadline: null,
    sprint: null,
    milestone: 'v1.2',
    size: 'M',
    estimate: 3,
    linked_prs: [],
    linked_issues: [],
    created_at: '2026-06-07',
    updated_at: '2026-06-07',
  }
  const builder = {
    select: () => builder,
    order: () => Promise.resolve({ data: [row], error: null }),
    insert: () => builder,
    single: () => Promise.resolve({ data: row, error: null }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }
  return { supabase: { from: () => builder }, isSupabaseConfigured: true }
})

const { fetchTicketing, createTicket, deleteTicket, updateTicket } =
  await import('@/services/ticketing.service')

describe('ticketing.service (Supabase mocké)', () => {
  it('mappe les lignes `tickets`', async () => {
    const data = await fetchTicketing('me')
    expect(data.tickets[0]).toMatchObject({
      id: 'u1',
      ref: 7,
      title: 'Ticket réel',
      toolId: null,
      milestone: 'v1.2',
      size: 'M',
      estimate: 3,
    })
    expect(data.assignees.length).toBeGreaterThan(0)
  })

  it('createTicket insère et renvoie le ticket', async () => {
    const t = await createTicket({ title: 'X', type: 'bug', priority: 'P1' })
    expect(t.id).toBe('u1')
    expect(t.priority).toBe('P1')
  })

  it('deleteTicket se résout', async () => {
    await expect(deleteTicket('u1')).resolves.toBeUndefined()
  })

  it('updateTicket se résout', async () => {
    await expect(updateTicket('u1', { status: 'done' })).resolves.toBeUndefined()
  })

  it('updateTicket accepte un patch multi-champs', async () => {
    await expect(
      updateTicket('u1', {
        priority: 'P1',
        assigneeId: 'coco',
        milestone: 'v1.3',
        size: 'L',
        estimate: 5,
      }),
    ).resolves.toBeUndefined()
  })
})
