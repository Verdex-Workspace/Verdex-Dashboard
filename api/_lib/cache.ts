// ============================================================
// Cache partagé (Upstash Redis, REST) pour les connecteurs serverless.
// Dégradation gracieuse : sans Upstash configuré, `withCache` exécute
// simplement le producteur sans mettre en cache (no-op transparent).
// Secrets serveur : UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
// ============================================================
import { Redis } from '@upstash/redis'

let client: Redis | null | undefined

function getClient(): Redis | null {
  if (client !== undefined) return client
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  client = url && token ? new Redis({ url, token }) : null
  return client
}

/** Indique si le cache Redis (Upstash) est configuré. */
export function isCacheConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/**
 * Renvoie la valeur en cache pour `key` ; sinon exécute `producer`, met en
 * cache `ttlSeconds` secondes, puis renvoie le résultat frais. Toute erreur de
 * cache est non bloquante (on retombe sur le producteur).
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  producer: () => Promise<T>,
): Promise<T> {
  const redis = getClient()
  if (!redis) return producer()
  try {
    const hit = await redis.get<T>(key)
    if (hit !== null && hit !== undefined) return hit
  } catch {
    // cache indisponible → on continue sans cache
  }
  const fresh = await producer()
  try {
    await redis.set(key, fresh, { ex: ttlSeconds })
  } catch {
    // échec d'écriture non bloquant
  }
  return fresh
}
