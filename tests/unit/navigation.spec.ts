import { describe, expect, it } from 'vitest'
import { NAV, NAV_FLAT, labelOf } from '@/data/navigation'

describe('navigation', () => {
  it('expose 9 modules répartis en 4 groupes', () => {
    expect(NAV).toHaveLength(4)
    expect(NAV_FLAT).toHaveLength(9)
  })

  it('contient le module "overview" comme point d\'entrée', () => {
    expect(NAV_FLAT.some((i) => i.id === 'overview')).toBe(true)
  })

  it('labelOf renvoie le libellé du module', () => {
    expect(labelOf('overview')).toBe("Vue d'ensemble")
  })

  it("labelOf renvoie l'id si inconnu", () => {
    expect(labelOf('inconnu')).toBe('inconnu')
  })
})
