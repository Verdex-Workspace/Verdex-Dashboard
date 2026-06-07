import { describe, expect, it } from 'vitest'
import { cvssBaseScore, severityFromScore } from '@/lib/cvss'

describe('cvssBaseScore (CVSS v3.1 base)', () => {
  it('vecteur critique complet → 9.8', () => {
    expect(cvssBaseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H')).toBe(9.8)
  })

  it('scope changé tout High → 10.0', () => {
    expect(cvssBaseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H')).toBe(10.0)
  })

  it('impact nul → 0.0', () => {
    expect(cvssBaseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N')).toBe(0)
  })

  it('confidentialité faible seule → 5.3', () => {
    expect(cvssBaseScore('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N')).toBe(5.3)
  })

  it('vecteur invalide / incomplet → 0', () => {
    expect(cvssBaseScore('garbage')).toBe(0)
    expect(cvssBaseScore('CVSS:3.1/AV:N/AC:L')).toBe(0)
  })
})

describe('severityFromScore', () => {
  it('mappe score → sévérité + couleur', () => {
    expect(severityFromScore(9.8)).toEqual({ kind: 'err', label: 'critique' })
    expect(severityFromScore(7.0)).toEqual({ kind: 'warn', label: 'élevée' })
    expect(severityFromScore(5.3)).toEqual({ kind: 'info', label: 'moyenne' })
    expect(severityFromScore(2.0)).toEqual({ kind: 'neutral', label: 'faible' })
    expect(severityFromScore(0)).toEqual({ kind: 'neutral', label: 'nulle' })
  })
})
