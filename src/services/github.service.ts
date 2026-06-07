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

export type GithubWriteAction = 'issue' | 'label' | 'milestone' | 'release' | 'close-issue'

export interface GithubWriteResult {
  ok: boolean
  url: string | null
  number: number | null
  name: string | null
}

/** Crée une ressource GitHub (issue/label/milestone/release) via la fonction serverless authentifiée. */
export async function githubWrite(
  repo: string,
  action: GithubWriteAction,
  payload: Record<string, unknown>,
): Promise<GithubWriteResult> {
  const res = await fetch('/api/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ repo, action, payload }),
  })
  const data = (await res.json().catch(() => ({}))) as GithubWriteResult & { error?: string }
  if (!res.ok) throw new Error(data.error ?? "Échec de l'écriture GitHub")
  return data
}

/** Ferme une issue GitHub (l'API ne permet pas la suppression). */
export async function closeGithubIssue(repo: string, number: number): Promise<GithubWriteResult> {
  return githubWrite(repo, 'close-issue', { number })
}
