import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchAudit, runAudit, runSynthesis } from '@/services/cyber.service'

afterEach(() => vi.unstubAllGlobals())

describe('cyber.service', () => {
  it('renvoie sources, questions, checks, scores et vulnérabilités', async () => {
    const data = await fetchAudit('me')
    expect(data.sources.length).toBeGreaterThan(0)
    expect(data.questions.length).toBeGreaterThan(0)
    expect(data.checks.length).toBeGreaterThan(0)
    expect(data.scores.length).toBeGreaterThan(0)
    expect(data.vulnerabilities.length).toBeGreaterThan(0)
  })

  it('chaque vulnérabilité a un CVSS et une anatomie complète', async () => {
    const { vulnerabilities } = await fetchAudit('me')
    for (const v of vulnerabilities) {
      expect(v.cvss).toBeTruthy()
      expect(v.why).toBeTruthy()
      expect(v.how).toBeTruthy()
      expect(v.benefits.length).toBeGreaterThan(0)
    }
  })
})

describe('runAudit', () => {
  it("renvoie le résultat de l'API quand des vulnérabilités sont présentes", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            fallback: false,
            scores: [{ key: 'Score sécurité', value: '88 / 100', kind: 'ok' }],
            vulnerabilities: [{ id: 'v1', finding: 'X', cvss: '7.5' }],
          }),
      }),
    )
    const r = await runAudit({ synthesis: 'S', checks: [] })
    expect(r.data.vulnerabilities).toHaveLength(1)
    expect(r.data.scores[0].value).toBe('88 / 100')
    expect(r.warning).toBeUndefined()
  })

  it('repli mock si fallback=true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ fallback: true, scores: [], vulnerabilities: [] }),
      }),
    )
    const r = await runAudit({ checks: [] })
    expect(r.data.vulnerabilities.length).toBeGreaterThan(0) // mock
    expect(r.warning).toBeTruthy()
  })

  it('repli mock si réponse en erreur', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }))
    const r = await runAudit({ checks: [] })
    expect(r.data.vulnerabilities.length).toBeGreaterThan(0)
    expect(r.warning).toContain('502')
  })

  it('repli mock en cas exception réseau', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    const r = await runAudit({ checks: [] })
    expect(r.data.vulnerabilities.length).toBeGreaterThan(0)
    expect(r.warning).toBe('réseau')
  })
})

describe('runSynthesis', () => {
  it("renvoie la synthèse de l'API quand présente", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            fallback: false,
            synthesis: 'Infra exposée.',
            questions: ['Q1'],
            topology: { servers: ['s1'], networks: [], ports: ['5432'] },
          }),
      }),
    )
    const r = await runSynthesis({ documents: [] })
    expect(r.data.synthesis).toBe('Infra exposée.')
    expect(r.data.topology.ports).toContain('5432')
    expect(r.warning).toBeUndefined()
  })

  it('repli mock + raison si fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ fallback: true, reason: 'llm_http_429' }),
      }),
    )
    const r = await runSynthesis({ documents: [] })
    expect(r.data.synthesis.length).toBeGreaterThan(0) // mock AUDIT_SYNTHESIS
    expect(r.warning).toBe('llm_http_429')
  })
})
