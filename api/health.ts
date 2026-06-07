// ============================================================
// Endpoint de santé : GET /api/health
// Renvoie l'état de l'environnement et la disponibilité (configurée ou non)
// des services serveur — uniquement des booléens, aucun secret exposé.
// ============================================================
import type { VercelRequest, VercelResponse } from './_lib/http'
import { isSupabaseConfigured } from './_lib/auth'
import { isCacheConfigured } from './_lib/cache'
import { isAnthropicConfigured } from './_lib/anthropic'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'method not allowed' })
    return
  }
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    status: 'ok',
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    services: {
      supabase: isSupabaseConfigured(),
      redis: isCacheConfigured(),
      github: Boolean(process.env.GITHUB_TOKEN),
      anthropic: isAnthropicConfigured(),
    },
    timestamp: new Date().toISOString(),
  })
}
