import { describe, expect, it } from 'vitest'
import { fetchOverview } from '@/services/overview.service'

describe('fetchOverview', () => {
  it("renvoie les blocs de la vue d'ensemble", async () => {
    const data = await fetchOverview('me')
    expect(data.kpis.length).toBeGreaterThan(0)
    expect(data.alerts.length).toBeGreaterThan(0)
    expect(data.automations.length).toBeGreaterThan(0)
    expect(data.tickets.length).toBeGreaterThan(0)
    expect(data.activity.length).toBeGreaterThan(0)
  })

  it('chaque KPI a une clé et une valeur', async () => {
    const { kpis } = await fetchOverview('me')
    for (const kpi of kpis) {
      expect(kpi.key).toBeTruthy()
      expect(kpi.value).toBeTruthy()
    }
  })
})
