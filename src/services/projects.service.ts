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

export async function fetchToolDetail(toolId: string): Promise<ToolDetail | null> {
  if (!supabase) return delay(TOOL_DETAILS[toolId] ?? null)
  const { data, error } = await supabase
    .from('tool_details')
    .select('*')
    .eq('tool_id', toolId)
    .maybeSingle()
  if (error || !data) return TOOL_DETAILS[toolId] ?? null
  return rowToDetail(data as ToolDetailRow)
}
