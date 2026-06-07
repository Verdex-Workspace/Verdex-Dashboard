/**
 * État de santé du backend (endpoint serverless `/api/health`). Renvoie `null`
 * si l'endpoint est indisponible (mode démo / pas de backend) → l'appelant peut
 * dégrader proprement.
 */
export interface HealthStatus {
  status: string
  env: string
  services: {
    supabase: boolean
    redis: boolean
    github: boolean
    llm: boolean
  }
  timestamp: string
}

export async function fetchHealth(): Promise<HealthStatus | null> {
  try {
    const res = await fetch('/api/health')
    if (!res.ok) return null
    return (await res.json()) as HealthStatus
  } catch {
    return null
  }
}
