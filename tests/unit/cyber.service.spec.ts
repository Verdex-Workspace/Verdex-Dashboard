import { describe, expect, it } from 'vitest'
import { fetchAudit } from '@/services/cyber.service'

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
