// ============================================================
// Types et utilitaires HTTP partagés par les fonctions serverless Vercel.
// (les fichiers/dossiers préfixés par `_` ne sont pas exposés comme routes)
// ============================================================

export interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

export interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
}

/** Extrait le jeton `Bearer` de l'en-tête Authorization (insensible à la casse). */
export function getBearerToken(req: VercelRequest): string | undefined {
  const header = req.headers?.authorization ?? req.headers?.Authorization
  const raw = Array.isArray(header) ? header[0] : header
  return raw?.startsWith('Bearer ') ? raw.slice(7) : undefined
}
