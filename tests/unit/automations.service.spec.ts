import { describe, expect, it } from 'vitest'
import { fetchAutomations } from '@/services/automations.service'

describe('automations.service', () => {
  it('renvoie des workflows avec graphe et logs', async () => {
    const { workflows } = await fetchAutomations('me')
    expect(workflows.length).toBeGreaterThan(0)
    for (const w of workflows) {
      expect(['n8n', 'make', 'zapier']).toContain(w.engine)
      expect(w.nodes.length).toBeGreaterThan(0)
      expect(w.edges.length).toBeGreaterThan(0)
      expect(w.logs.length).toBeGreaterThan(0)
    }
  })

  it('les arêtes référencent des nœuds existants', async () => {
    const { workflows } = await fetchAutomations('me')
    for (const w of workflows) {
      const ids = new Set(w.nodes.map((n) => n.id))
      for (const e of w.edges) {
        expect(ids.has(e.from) && ids.has(e.to)).toBe(true)
      }
    }
  })
})
