import { describe, expect, it } from 'vitest'
import { fetchProton } from '@/services/proton.service'

describe('proton.service', () => {
  it('renvoie toutes les sections Proton', async () => {
    const d = await fetchProton('me')
    expect(d.kpis.length).toBeGreaterThan(0)
    expect(d.mail.items.length).toBeGreaterThan(0)
    expect(d.calendar.length).toBeGreaterThan(0)
    expect(d.auth.length).toBeGreaterThan(0)
    expect(d.drive.length).toBeGreaterThan(0)
    expect(d.docs.length).toBeGreaterThan(0)
  })

  it('expose le compte de mots de passe réutilisés/faibles', async () => {
    const { pass } = await fetchProton('me')
    expect(pass.count).toBeGreaterThan(0)
    expect(pass.reused).toBeGreaterThanOrEqual(0)
    expect(pass.weak).toBeGreaterThanOrEqual(0)
  })
})
