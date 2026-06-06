import type {
  Commit,
  Dependency,
  Deployment,
  Issue,
  PullRequest,
  Tool,
  ToolDetail,
  ToolLink,
  ToolMetric,
  Environment,
  StatusKind,
} from '@/types'
import { TOOLS, TOOL_DETAILS } from '@/data/mock/projects'
import { supabase } from '@/lib/supabase'
import { fetchGithubDetail } from '@/services/github.service'

/**
 * Service du module Projets & Outils.
 *
 * - Supabase configuré → lecture des tables `tools` / `tool_details`.
 * - Sinon (mode démo, CI) → données mock.
 * En cas d'erreur ou de table vide, repli automatique sur les données mock
 * pour ne jamais présenter d'écran vide.
 */

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

interface ToolRow {
  id: string
  name: string
  env: Environment
  status: StatusKind
  version: string
  stack: string
  icon: string
  open_prs: number
  open_issues: number
  repo: string | null
}

interface ToolDetailRow {
  tool_id: string
  port: number
  description: string
  metrics: ToolMetric[]
  dependencies: Dependency[]
  links: ToolLink[]
  commits: Commit[]
  pull_requests: PullRequest[]
  issues: Issue[]
  deployments: Deployment[]
}

function rowToTool(r: ToolRow): Tool {
  return {
    id: r.id,
    name: r.name,
    env: r.env,
    status: r.status,
    version: r.version,
    stack: r.stack,
    icon: r.icon,
    openPrs: r.open_prs,
    openIssues: r.open_issues,
    repo: r.repo,
  }
}

function rowToDetail(r: ToolDetailRow): ToolDetail {
  return {
    id: r.tool_id,
    port: r.port,
    description: r.description,
    metrics: r.metrics,
    dependencies: r.dependencies,
    links: r.links,
    commits: r.commits,
    pullRequests: r.pull_requests,
    issues: r.issues,
    deployments: r.deployments,
  }
}

export async function fetchTools(_clientId: string): Promise<Tool[]> {
  // _clientId servira au filtrage multi-espaces (via RLS) ultérieurement.
  if (!supabase) return delay(TOOLS)
  const { data, error } = await supabase.from('tools').select('*').order('name')
  if (error || !data || data.length === 0) return TOOLS
  return (data as ToolRow[]).map(rowToTool)
}

async function baseDetail(toolId: string): Promise<ToolDetail | null> {
  if (!supabase) return delay(TOOL_DETAILS[toolId] ?? null)
  const { data, error } = await supabase
    .from('tool_details')
    .select('*')
    .eq('tool_id', toolId)
    .maybeSingle()
  if (error || !data) return TOOL_DETAILS[toolId] ?? null
  return rowToDetail(data as ToolDetailRow)
}

export async function fetchToolDetail(
  toolId: string,
  repo?: string | null,
): Promise<ToolDetail | null> {
  const base = await baseDetail(toolId)

  // Enrichissement par les données GitHub réelles si un dépôt est lié.
  if (repo) {
    const gh = await fetchGithubDetail(repo)
    if (gh) {
      return {
        id: toolId,
        port: base?.port ?? 0,
        description: gh.description ?? base?.description ?? '',
        metrics: base?.metrics ?? [],
        dependencies: base?.dependencies ?? [],
        links: base?.links ?? [],
        commits: gh.commits.length ? gh.commits : (base?.commits ?? []),
        pullRequests: gh.pullRequests.length ? gh.pullRequests : (base?.pullRequests ?? []),
        issues: gh.issues.length ? gh.issues : (base?.issues ?? []),
        deployments: gh.deployments.length ? gh.deployments : (base?.deployments ?? []),
        readme: gh.readme,
      }
    }
  }

  return base
}
