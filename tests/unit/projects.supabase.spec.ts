import { describe, expect, it, vi } from 'vitest'

// Mocke le client Supabase pour couvrir le chemin "base de données".
vi.mock('@/lib/supabase', () => {
  const toolsRows = [
    {
      id: 'x',
      name: 'x-service',
      env: 'prod',
      status: 'ok',
      version: '1.0.0',
      stack: 'Go',
      icon: '⛨',
      open_prs: 1,
      open_issues: 2,
    },
  ]
  const detailRow = {
    tool_id: 'x',
    port: 80,
    description: 'desc',
    metrics: [{ key: 'Uptime', value: '99%', kind: 'ok' }],
    dependencies: [{ name: 'go', upToDate: true }],
    links: [{ label: 'repo', url: '#' }],
    commits: [],
    pull_requests: [{ id: '1', title: 'PR', status: 'ok', detail: 'open' }],
    issues: [],
    deployments: [{ env: 'prod', version: '1.0.0', when: 'now', status: 'ok' }],
  }
  const builder = {
    select: () => builder,
    order: () => Promise.resolve({ data: toolsRows, error: null }),
    eq: () => builder,
    maybeSingle: () => Promise.resolve({ data: detailRow, error: null }),
  }
  return { supabase: { from: () => builder }, isSupabaseConfigured: true }
})

const { fetchTools, fetchToolDetail } = await import('@/services/projects.service')

describe('projects.service (via Supabase mocké)', () => {
  it('mappe les lignes `tools` (snake_case → camelCase)', async () => {
    const tools = await fetchTools('me')
    expect(tools).toHaveLength(1)
    expect(tools[0]).toMatchObject({ id: 'x', name: 'x-service', openPrs: 1, openIssues: 2 })
  })

  it('mappe le détail (`pull_requests` → `pullRequests`)', async () => {
    const detail = await fetchToolDetail('x')
    expect(detail?.id).toBe('x')
    expect(detail?.port).toBe(80)
    expect(detail?.pullRequests).toHaveLength(1)
    expect(detail?.deployments[0].env).toBe('prod')
  })
})
