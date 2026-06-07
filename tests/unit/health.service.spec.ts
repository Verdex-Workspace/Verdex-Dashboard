import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchHealth } from '@/services/health.service'

afterEach(() => vi.unstubAllGlobals())

describe('health.service', () => {
  it('renvoie le statut quand la réponse est OK', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'ok',
            env: 'production',
            services: { supabase: true, redis: false, github: true },
            timestamp: '2026-06-07T00:00:00.000Z',
          }),
      }),
    )
    const r = await fetchHealth()
    expect(r?.status).toBe('ok')
    expect(r?.services.supabase).toBe(true)
    expect(r?.services.redis).toBe(false)
  })

  it('renvoie null si la réponse est en erreur', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    expect(await fetchHealth()).toBeNull()
  })

  it("renvoie null en cas d'exception réseau", async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    expect(await fetchHealth()).toBeNull()
  })
})
