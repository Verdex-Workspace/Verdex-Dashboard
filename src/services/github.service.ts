import type { Commit, Deployment, Issue, PullRequest } from '@/types'
import { supabase } from '@/lib/supabase'

/**
 * Données GitHub réelles d'un dépôt, servies par la fonction serverless
 * `/api/github` (le jeton GitHub reste côté serveur). L'appel est authentifié
 * par le jeton de session Supabase. Renvoie `null` si indisponible/non autorisé
 * → repli côté appelant.
 */
export interface RepoMeta {
  name: string
  language: string | null
  private: boolean
  openPrs: number
  openIssues: number
}

export interface GithubDetail {
  description: string | null
  readme: string | null
  commits: Commit[]
  pullRequests: PullRequest[]
  issues: Issue[]
  deployments: Deployment[]
  meta: RepoMeta
}

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchGithubDetail(repo: string): Promise<GithubDetail | null> {
  try {
    const res = await fetch(`/api/github?repo=${encodeURIComponent(repo)}`, {
      headers: await authHeader(),
    })
    if (!res.ok) return null
    return (await res.json()) as GithubDetail
  } catch {
    return null
  }
}
