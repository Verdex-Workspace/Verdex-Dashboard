import type { Commit, Deployment, Issue, PullRequest } from '@/types'

/**
 * Données GitHub réelles d'un dépôt, servies par la fonction serverless
 * `/api/github` (le jeton reste côté serveur). Renvoie `null` si l'API n'est
 * pas disponible (dev local sans `vercel dev`, hors-ligne…) → repli côté appelant.
 */
export interface GithubDetail {
  description: string | null
  readme: string | null
  commits: Commit[]
  pullRequests: PullRequest[]
  issues: Issue[]
  deployments: Deployment[]
}

export async function fetchGithubDetail(repo: string): Promise<GithubDetail | null> {
  try {
    const res = await fetch(`/api/github?repo=${encodeURIComponent(repo)}`)
    if (!res.ok) return null
    return (await res.json()) as GithubDetail
  } catch {
    return null
  }
}
