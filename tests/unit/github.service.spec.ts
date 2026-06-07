import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGithubDetail, githubWrite } from '@/services/github.service'

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

describe('githubWrite', () => {
  it('renvoie la ressource créée quand OK', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, url: 'https://gh/x/1', number: 1, name: 'bug' }),
      }),
    )
    const r = await githubWrite('o/r', 'issue', { title: 'T' })
    expect(r.number).toBe(1)
    expect(r.url).toBe('https://gh/x/1')
  })

  it("lève avec le message d'erreur GitHub", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Validation failed' }),
      }),
    )
    await expect(githubWrite('o/r', 'label', { name: '' })).rejects.toThrow('Validation failed')
  })
})

describe('closeGithubIssue', () => {
  it("appelle l'endpoint et renvoie le résultat", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, url: 'https://gh/x/3', number: 3, name: null }),
      }),
    )
    const { closeGithubIssue } = await import('@/services/github.service')
    const r = await closeGithubIssue('o/r', 3)
    expect(r.number).toBe(3)
  })
})
