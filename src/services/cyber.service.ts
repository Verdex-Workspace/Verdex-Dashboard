import type { AuditData, AuditResult, AuditScore, Vulnerability } from '@/types'
import {
  AUDIT_CHECKS,
  AUDIT_QUESTIONS,
  AUDIT_SCORES,
  AUDIT_SOURCES,
  VULNERABILITIES,
} from '@/data/mock/cyber'
import { supabase } from '@/lib/supabase'

/**
 * Service du module Cybersécurité.
 *
 * - Audit réel via la fonction serverless `/api/audit` (signaux GitHub → analyse
 *   Claude → score CVSS local). Repli mock si l'API n'est pas configurée.
 * - Rapports persistés dans Supabase (`audit_reports`, RLS) quand disponible.
 * - Le scaffolding du pipeline (sources/questions/checks) reste statique.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const MOCK_RESULT: AuditResult = { scores: AUDIT_SCORES, vulnerabilities: VULNERABILITIES }

export interface AuditInput {
  repo?: string | null
  checks?: string[]
  notes?: string
}

/** Lance un audit via `/api/audit` ; repli mock si indisponible/non configuré. */
export async function runAudit(input: AuditInput): Promise<AuditResult> {
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify(input),
    })
    if (!res.ok) return MOCK_RESULT
    const data = (await res.json()) as Partial<AuditResult> & { fallback?: boolean }
    if (data.fallback || !data.vulnerabilities?.length) return MOCK_RESULT
    return { scores: data.scores ?? [], vulnerabilities: data.vulnerabilities }
  } catch {
    return MOCK_RESULT
  }
}

interface ReportRow {
  id: string
  repo: string | null
  scores: AuditScore[]
  vulnerabilities: Vulnerability[]
  created_at: string
}

/** Persiste un rapport d'audit (no-op hors Supabase). */
export async function saveReport(
  result: AuditResult,
  repo: string | null,
  clientId = 'me',
): Promise<void> {
  if (!supabase) return
  await supabase.from('audit_reports').insert({
    client_id: clientId,
    repo,
    scores: result.scores,
    vulnerabilities: result.vulnerabilities,
  })
}

/** Dernier rapport persisté pour un client (ou null). */
export async function fetchLatestReport(clientId: string): Promise<AuditResult | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('audit_reports')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  const r = data as ReportRow
  return { scores: r.scores ?? [], vulnerabilities: r.vulnerabilities ?? [] }
}

export async function fetchAudit(clientId: string): Promise<AuditData> {
  const latest = await fetchLatestReport(clientId)
  return delay({
    sources: AUDIT_SOURCES,
    questions: AUDIT_QUESTIONS,
    checks: AUDIT_CHECKS,
    scores: latest?.scores.length ? latest.scores : AUDIT_SCORES,
    vulnerabilities: latest?.vulnerabilities.length ? latest.vulnerabilities : VULNERABILITIES,
  })
}
