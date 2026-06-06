import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase.
 *
 * L'app fonctionne en **mode démo** (données mock, sans authentification) tant
 * que l'URL et la clé `anon` ne sont pas fournies — ce qui garde la CI et le dev
 * local sans secret pleinement fonctionnels. Dès que les variables sont
 * présentes (`.env.local` ou Vercel), l'authentification réelle s'active.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
