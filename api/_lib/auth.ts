// ============================================================
// Authentification serveur : vérification du jeton de session Supabase.
// Partagé par toutes les fonctions serverless qui exposent des données
// sensibles ou utilisent un secret serveur.
// ============================================================

function supabaseUrl(): string | undefined {
  return process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
}
function supabaseAnon(): string | undefined {
  return process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY
}

/** Indique si Supabase est configuré côté serveur (URL + clé anon). */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnon())
}

/** Vérifie un jeton de session Supabase auprès de l'API Auth (`/auth/v1/user`). */
export async function verifyUser(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const url = supabaseUrl()
  const anon = supabaseAnon()
  if (!url || !anon) return false
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anon },
    })
    return res.ok
  } catch {
    return false
  }
}
