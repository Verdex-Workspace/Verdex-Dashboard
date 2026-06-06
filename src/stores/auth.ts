import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

/**
 * Authentification (Supabase). En mode démo (Supabase non configuré), l'accès
 * est ouvert et aucune connexion n'est requise.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const ready = ref(false)
  const demoMode = !isSupabaseConfigured

  const isAuthenticated = computed(() => demoMode || session.value !== null)
  const displayName = computed(
    () => user.value?.email ?? user.value?.user_metadata?.full_name ?? 'Mode démo',
  )

  /** Initialise la session et écoute les changements d'état d'auth. */
  async function init() {
    if (ready.value) return
    if (!supabase) {
      ready.value = true
      return
    }
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
    supabase.auth.onAuthStateChange((_event, next) => {
      session.value = next
      user.value = next?.user ?? null
    })
    ready.value = true
  }

  async function signInWithPassword(email: string, password: string) {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signInWithGitHub() {
    if (!supabase) throw new Error('Supabase non configuré')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  async function signOut() {
    await supabase?.auth.signOut()
    session.value = null
    user.value = null
  }

  return {
    user,
    session,
    ready,
    demoMode,
    isAuthenticated,
    displayName,
    init,
    signInWithPassword,
    signInWithGitHub,
    signOut,
  }
})
