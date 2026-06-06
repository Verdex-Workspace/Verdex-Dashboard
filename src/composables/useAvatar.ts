import { computed, ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Source d'avatar de l'utilisateur, en cascade :
 * 1. avatar GitHub (user_metadata.avatar_url)
 * 2. Gravatar dérivé de l'email (hash SHA-256, `d=404` → repli si absent)
 * 3. initiales (si l'image échoue ou n'existe pas)
 */
export function useAvatar() {
  const auth = useAuthStore()
  const src = ref<string | null>(null)
  const failed = ref(false)

  const initials = computed(() => {
    if (auth.demoMode) return '★'
    const base = auth.displayName || auth.email || '?'
    return base.trim().charAt(0).toUpperCase() || '?'
  })

  watchEffect(async () => {
    failed.value = false
    if (auth.avatarUrl) {
      src.value = auth.avatarUrl
      return
    }
    if (auth.email && typeof crypto !== 'undefined' && crypto.subtle) {
      const hash = await sha256Hex(auth.email.trim().toLowerCase())
      src.value = `https://www.gravatar.com/avatar/${hash}?d=404&s=80`
      return
    }
    src.value = null
  })

  function onError() {
    failed.value = true
  }

  return { src, initials, failed, onError }
}
