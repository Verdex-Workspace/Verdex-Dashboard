import { describe, expect, it, vi } from 'vitest'

vi.mock('@/services/github.service', () => ({
  fetchGithubDetail: vi.fn().mockResolvedValue({
    description: null,
    readme: null,
    commits: [],
    pullRequests: [],
    issues: [],
    deployments: [],
    meta: { name: 'mon-projet', language: 'TypeScript', private: false, openPrs: 1, openIssues: 2 },
  }),
}))

vi.mock('@/lib/supabase', () => {
  const builder = {
    select: () => builder,
    order: () => Promise.resolve({ data: [], error: null }),
    upsert: () => Promise.resolve({ error: null }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }
  return { supabase: { from: () => builder }, isSupabaseConfigured: true }
})

const { trackRepo, untrackRepo } = await import('@/services/projects.service')

describe('suivi de dépôts', () => {
  it('trackRepo crée un outil depuis les métadonnées GitHub', async () => {
    const tool = await trackRepo('Verdex-Workspace/mon-projet')
    expect(tool.id).toBe('Verdex-Workspace/mon-projet')
    expect(tool.name).toBe('mon-projet')
    expect(tool.stack).toBe('TypeScript')
    expect(tool.openPrs).toBe(1)
    expect(tool.openIssues).toBe(2)
    expect(tool.repo).toBe('Verdex-Workspace/mon-projet')
  })

  it('untrackRepo se résout sans erreur', async () => {
    await expect(untrackRepo('Verdex-Workspace/mon-projet')).resolves.toBeUndefined()
  })
})
