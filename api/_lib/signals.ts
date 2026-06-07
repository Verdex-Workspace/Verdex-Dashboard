// ============================================================
// Collecte de signaux GitHub (lecture seule, best-effort) pour alimenter
// l'audit de sécurité. Chaque appel échoué renvoie une valeur neutre :
// un signal indisponible n'interrompt jamais l'audit.
// ============================================================

const API = 'https://api.github.com'

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'verdex-dashboard',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: ghHeaders() })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export interface RepoSignals {
  repo: string
  private: boolean | null
  defaultBranch: string | null
  language: string | null
  branchProtected: boolean
  hasCiWorkflow: boolean
  hasCodeqlWorkflow: boolean
  hasDependabot: boolean
}

/** Rassemble quelques signaux de posture sécurité d'un dépôt `owner/name`. */
export async function collectSignals(repo: string): Promise<RepoSignals> {
  const info = await gh<{ private: boolean; default_branch: string; language: string | null }>(
    `/repos/${repo}`,
  )
  const defaultBranch = info?.default_branch ?? null

  const [protection, workflows, dependabot] = await Promise.all([
    defaultBranch
      ? gh<unknown>(`/repos/${repo}/branches/${defaultBranch}/protection`)
      : Promise.resolve(null),
    gh<{ workflows: { path: string }[] }>(`/repos/${repo}/actions/workflows`),
    gh<unknown>(`/repos/${repo}/contents/.github/dependabot.yml`),
  ])

  const paths = (workflows?.workflows ?? []).map((w) => w.path.toLowerCase())
  return {
    repo,
    private: info?.private ?? null,
    defaultBranch,
    language: info?.language ?? null,
    branchProtected: Boolean(protection),
    hasCiWorkflow: paths.some((p) => p.includes('ci')),
    hasCodeqlWorkflow: paths.some((p) => p.includes('codeql')),
    hasDependabot: Boolean(dependabot),
  }
}
