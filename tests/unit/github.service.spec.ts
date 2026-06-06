import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGithubDetail } from '@/services/github.service'

afterEach(() => vi.unstubAllGlobals())

describe('github.service', () => {
  it('renvoie les données quand la réponse est OK', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            description: 'desc',
            readme: '# Readme',
            commits: [],
            pullRequests: [],
            issues: [],
            deployments: [],
          }),
      }),
    )
    const r = await fetchGithubDetail('owner/name')
    expect(r?.description).toBe('desc')
    expect(r?.readme).toBe('# Readme')
  })

  it('renvoie null si la réponse est en erreur', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    expect(await fetchGithubDetail('owner/name')).toBeNull()
  })

  it("renvoie null en cas d'exception réseau", async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    expect(await fetchGithubDetail('owner/name')).toBeNull()
  })
})
