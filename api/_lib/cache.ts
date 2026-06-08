// ============================================================
// Cache partagé (Upstash Redis, REST) pour les connecteurs serverless.
// Dégradation gracieuse : sans Upstash configuré, `withCache` exécute
// simplement le producteur sans mettre en cache (no-op transparent).
//
// ⚠️ `@upstash/redis` est importé **dynamiquement** et seulement quand le cache
// est configuré : une fonction sans Upstash ne charge jamais ce module (évite
// tout crash de chargement de la fonction serverless).
// Secrets serveur : UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
// ============================================================

interface RedisLike {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown, opts: { ex: number }): Promise<unknown>
}

let clientPromise: Promise<RedisLike | null> | undefined

/** Indique si le cache Redis (Upstash) est configuré. */
export function isCacheConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

async function getClient(): Promise<RedisLike | null> {
  if (!isCacheConfigured()) return null
  if (clientPromise) return clientPromise
  clientPromise = (async () => {
    try {
      const { Redis } = await import('@upstash/redis')
      return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL as string,
        token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
      }) as unknown as RedisLike
    } catch {
      return null
    }
  })()
  return clientPromise
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
  const redis = await getClient()
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
