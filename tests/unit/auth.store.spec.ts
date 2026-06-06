import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// En environnement de test, aucune variable Supabase n'est définie :
// le store doit fonctionner en mode démo (accès ouvert).
describe('useAuthStore (mode démo)', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('est en mode démo et authentifié', () => {
    const auth = useAuthStore()
    expect(auth.demoMode).toBe(true)
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.displayName).toBe('Mode démo')
  })

  it('init() marque le store prêt sans Supabase', async () => {
    const auth = useAuthStore()
    await auth.init()
    expect(auth.ready).toBe(true)
  })

  it('signOut() ne lève pas et réinitialise la session', async () => {
    const auth = useAuthStore()
    await auth.signOut()
    expect(auth.session).toBeNull()
    expect(auth.user).toBeNull()
  })
})

describe('useAuthStore — provider & mot de passe (mode démo)', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it("expose le provider 'demo' et un avatar nul", () => {
    const auth = useAuthStore()
    expect(auth.provider).toBe('demo')
    expect(auth.avatarUrl).toBeNull()
    expect(auth.email).toBeNull()
  })

  it('updatePassword lève hors Supabase', async () => {
    const auth = useAuthStore()
    await expect(auth.updatePassword('motdepasse123')).rejects.toThrow()
  })
})
