/**
 * Fonction serverless Vercel : agrège les données GitHub d'un dépôt
 * (description, README, commits, PR, issues, déploiements).
 *
 * Le jeton GitHub reste **côté serveur** (variable d'env `GITHUB_TOKEN`),
 * jamais exposé au navigateur. Sans jeton, l'API publique GitHub est utilisée
 * (limite de débit plus basse). Réponses mises en cache 5 min par le CDN.
 *
 * Usage : GET /api/github?repo=owner/name
 */

interface VercelRequest {
  query: Record<string, string | string[] | undefined>
}
interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
}

const API = 'https://api.github.com'

function headers() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'verdex-dashboard',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

function relativeAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return "à l'instant"
  if (h < 24) return `${h} h`
  return `${Math.floor(h / 24)} j`
}

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers() })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function readme(repo: string): Promise<string | null> {
  try {
    const res = await fetch(`${API}/repos/${repo}/readme`, {
      headers: { ...headers(), Accept: 'application/vnd.github.raw' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const repoParam = req.query.repo
  const repo = Array.isArray(repoParam) ? repoParam[0] : repoParam
  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    res.status(400).json({ error: 'invalid repo' })
    return
  }

  type RepoInfo = { description: string | null }
  type CommitItem = { sha: string; commit: { message: string; author: { date: string } } }
  type PrItem = { number: number; title: string; draft: boolean }
  type IssueItem = {
    number: number
    title: string
    pull_request?: unknown
    labels: { name: string }[]
  }
  type DeployItem = { environment: string; ref: string; created_at: string }

  const [info, commits, pulls, issues, deployments, readmeText] = await Promise.all([
    gh<RepoInfo>(`/repos/${repo}`),
    gh<CommitItem[]>(`/repos/${repo}/commits?per_page=6`),
    gh<PrItem[]>(`/repos/${repo}/pulls?state=open&per_page=8`),
    gh<IssueItem[]>(`/repos/${repo}/issues?state=open&per_page=10`),
    gh<DeployItem[]>(`/repos/${repo}/deployments?per_page=5`),
    readme(repo),
  ])

  if (!info && !commits) {
    res.status(502).json({ error: 'github unreachable or repo not found' })
    return
  }

  const payload = {
    description: info?.description ?? null,
    readme: readmeText,
    commits: (commits ?? []).map((c) => ({
      hash: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      age: relativeAge(c.commit.author.date),
    })),
    pullRequests: (pulls ?? []).map((p) => ({
      id: String(p.number),
      title: p.title,
      status: p.draft ? 'warn' : 'ok',
      detail: p.draft ? 'brouillon' : 'ouverte',
    })),
    issues: (issues ?? [])
      .filter((i) => !i.pull_request)
      .map((i) => ({
        id: String(i.number),
        kind: 'info',
        title: i.title,
        meta: i.labels.map((l) => l.name).join(' · ') || 'issue',
      })),
    deployments: (deployments ?? []).map((d) => ({
      env: d.environment,
      version: d.ref,
      when: relativeAge(d.created_at),
      status: 'ok',
    })),
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.status(200).json(payload)
}
