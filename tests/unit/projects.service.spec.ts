import { describe, expect, it } from 'vitest'
import { fetchToolDetail, fetchTools } from '@/services/projects.service'

describe('projects.service', () => {
  it('fetchTools renvoie la liste des outils', async () => {
    const tools = await fetchTools('me')
    expect(tools.length).toBeGreaterThan(0)
    for (const t of tools) {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(['prod', 'staging', 'dev']).toContain(t.env)
    }
  })

  it("fetchToolDetail renvoie le détail d'un outil connu", async () => {
    const detail = await fetchToolDetail('novaweb')
    expect(detail).not.toBeNull()
    expect(detail?.id).toBe('novaweb')
    expect(detail?.metrics.length).toBeGreaterThan(0)
    expect(detail?.deployments.length).toBeGreaterThan(0)
  })

  it('fetchToolDetail renvoie null pour un outil inconnu', async () => {
    expect(await fetchToolDetail('inconnu')).toBeNull()
  })

  it('chaque outil de la liste possède un détail', async () => {
    const tools = await fetchTools('me')
    for (const t of tools) {
      expect(await fetchToolDetail(t.id), `détail manquant pour ${t.id}`).not.toBeNull()
    }
  })
})
