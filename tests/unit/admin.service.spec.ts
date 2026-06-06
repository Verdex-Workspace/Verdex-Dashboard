import { describe, expect, it } from 'vitest'
import { fetchInfra } from '@/services/admin.service'

describe('admin.service', () => {
  it('renvoie ports, conteneurs, compose et scripts', async () => {
    const data = await fetchInfra('me')
    expect(data.ports.length).toBeGreaterThan(0)
    expect(data.containers.length).toBeGreaterThan(0)
    expect(data.compose.length).toBeGreaterThan(0)
    expect(data.scripts.length).toBeGreaterThan(0)
  })

  it('signale Postgres 5432 exposé en public (incident)', async () => {
    const { ports } = await fetchInfra('me')
    const pg = ports.find((p) => p.port === 5432)!
    expect(pg.exposure).toBe('public')
    expect(pg.status).toBe('err')
  })
})
