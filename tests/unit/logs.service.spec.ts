import { describe, expect, it } from 'vitest'
import { fetchLogs } from '@/services/logs.service'

describe('logs.service', () => {
  it('renvoie sources, kpis, charts et entries', async () => {
    const data = await fetchLogs('me')
    expect(data.sources.length).toBeGreaterThan(0)
    expect(data.kpis.length).toBeGreaterThan(0)
    expect(data.charts.length).toBe(3)
    expect(data.entries.length).toBeGreaterThan(0)
  })

  it('chaque entrée a un niveau valide', async () => {
    const { entries } = await fetchLogs('me')
    for (const e of entries) {
      expect(['ERROR', 'WARN', 'INFO', 'DEBUG']).toContain(e.level)
    }
  })
})
