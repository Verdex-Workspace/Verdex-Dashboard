/**
 * Fonction serverless Vercel : agrège les données GitHub d'un dépôt
 * (description, README, commits, PR, issues, déploiements, méta).
 *
 * 🔒 Sécurité : l'appel exige un **jeton de session Supabase valide**
 * (en-tête Authorization: Bearer …), vérifié côté serveur. Indispensable dès
 * lors que le `GITHUB_TOKEN` peut lire des dépôts privés.
 *
 * Le `GITHUB_TOKEN` reste **côté serveur**, jamais exposé au navigateur.
 *
 * Usage : GET /api/github?repo=owner/name  (Authorization: Bearer <supabase access_token>)
 */

interface VercelRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}
interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
}

const API = 'https://api.github.com'

function ghHeaders() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'verdex-dashboard',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

/** Vérifie le jeton de session Supabase auprès de l'API Auth. */
async function verifyUser(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const anon = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY
  if (!url || !anon) return false
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anon },
    })
    return res.ok
  } catch {
    return false
  }
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
    const res = await fetch(`${API}${path}`, { headers: ghHeaders() })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function readme(repo: string): Promise<string | null> {
  try {
    const res = await fetch(`${API}/repos/${repo}/readme`, {
      headers: { ...ghHeaders(), Accept: 'application/vnd.github.raw' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

const WRITE_PATHS: Record<string, (repo: string) => string> = {
  issue: (r) => `/repos/${r}/issues`,
  label: (r) => `/repos/${r}/labels`,
  milestone: (r) => `/repos/${r}/milestones`,
  release: (r) => `/repos/${r}/releases`,
}

/** Crée une ressource GitHub (issue, label, milestone, release) ou ferme une issue. */
async function writeAction(body: unknown, res: VercelResponse) {
  const b = (body ?? {}) as { repo?: string; action?: string; payload?: Record<string, unknown> }
  if (!b.repo || !/^[\w.-]+\/[\w.-]+$/.test(b.repo) || !b.action) {
    res.status(400).json({ error: 'invalid request' })
    return
  }

  // Fermeture d'une issue (PATCH) — l'API REST ne permet pas de supprimer une issue.
  if (b.action === 'close-issue') {
    const num = Number((b.payload as { number?: number } | undefined)?.number)
    if (!num) {
      res.status(400).json({ error: 'missing issue number' })
      return
    }
    try {
      const r = await fetch(`${API}/repos/${b.repo}/issues/${num}`, {
        method: 'PATCH',
        headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'closed' }),
      })
      const data = (await r.json()) as Record<string, unknown>
      if (!r.ok) {
        res.status(r.status).json({ error: (data?.message as string) ?? 'github error' })
        return
      }
      res.status(200).json({ ok: true, url: data.html_url ?? null, number: num, name: null })
    } catch {
      res.status(502).json({ error: 'github unreachable' })
    }
    return
  }

  const pathFor = WRITE_PATHS[b.action]
  if (!pathFor) {
    res.status(400).json({ error: 'unknown action' })
    return
  }
  try {
    const r = await fetch(`${API}${pathFor(b.repo)}`, {
      method: 'POST',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(b.payload ?? {}),
    })
    const data = (await r.json()) as Record<string, unknown>
    if (!r.ok) {
      res.status(r.status).json({ error: (data?.message as string) ?? 'github error' })
      return
    }
    res.status(201).json({
      ok: true,
      url: data.html_url ?? null,
      number: data.number ?? data.id ?? null,
      name: data.name ?? data.title ?? data.tag_name ?? null,
    })
  } catch {
    res.status(502).json({ error: 'github unreachable' })
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers?.authorization ?? req.headers?.Authorization
  const raw = Array.isArray(authHeader) ? authHeader[0] : authHeader
  const token = raw?.startsWith('Bearer ') ? raw.slice(7) : undefined
  if (!(await verifyUser(token))) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  // ----- Écritures (POST) -----
  if (req.method === 'POST') {
    await writeAction(req.body, res)
    return
  }

  const repoParam = req.query.repo
  const repo = Array.isArray(repoParam) ? repoParam[0] : repoParam
  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    res.status(400).json({ error: 'invalid repo' })
    return
  }

  type RepoInfo = { description: string | null; language: string | null; private: boolean }
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

  const issueList = (issues ?? []).filter((i) => !i.pull_request)
  const prList = pulls ?? []

  const payload = {
    description: info?.description ?? null,
    readme: readmeText,
    commits: (commits ?? []).map((c) => ({
      hash: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      age: relativeAge(c.commit.author.date),
    })),
    pullRequests: prList.map((p) => ({
      id: String(p.number),
      title: p.title,
      status: p.draft ? 'warn' : 'ok',
      detail: p.draft ? 'brouillon' : 'ouverte',
    })),
    issues: issueList.map((i) => ({
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
    meta: {
      name: repo.split('/')[1],
      language: info?.language ?? null,
      private: info?.private ?? false,
      openPrs: prList.length,
      openIssues: issueList.length,
    },
  }

  res.setHeader('Cache-Control', 'private, s-maxage=120, stale-while-revalidate=300')
  res.status(200).json(payload)
}
