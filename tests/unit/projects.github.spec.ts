import { describe, expect, it, vi } from 'vitest'

// Supabase non configuré dans les tests → baseDetail vient des données mock.
// On mocke le service GitHub pour valider l'enrichissement.
vi.mock('@/services/github.service', () => ({
  fetchGithubDetail: vi.fn().mockResolvedValue({
    description: 'description réelle',
    readme: '# Verdex',
    commits: [{ hash: 'abc1234', message: 'feat: réel', age: '1 h' }],
    pullRequests: [{ id: '9', title: 'PR réelle', status: 'ok', detail: 'ouverte' }],
    issues: [],
    deployments: [],
  }),
}))

const { fetchToolDetail } = await import('@/services/projects.service')

describe('fetchToolDetail — enrichissement GitHub', () => {
  it('fusionne les données GitHub réelles quand un repo est fourni', async () => {
    const d = await fetchToolDetail('novaweb', 'Verdex-Workspace/x')
    expect(d?.readme).toBe('# Verdex')
    expect(d?.description).toBe('description réelle')
    expect(d?.commits[0].hash).toBe('abc1234')
    expect(d?.pullRequests[0].title).toBe('PR réelle')
  })

  it('sans repo, conserve les données de base (mock)', async () => {
    const d = await fetchToolDetail('novaweb')
    expect(d?.readme).toBeUndefined()
    expect(d?.id).toBe('novaweb')
  })
})
