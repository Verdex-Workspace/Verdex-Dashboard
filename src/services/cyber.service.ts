import type {
  AuditData,
  AuditDocument,
  AuditResult,
  AuditScore,
  AuditSynthesis,
  Vulnerability,
} from '@/types'
import {
  AUDIT_CHECKS,
  AUDIT_QUESTIONS,
  AUDIT_SCORES,
  AUDIT_SOURCES,
  AUDIT_SYNTHESIS,
  VULNERABILITIES,
} from '@/data/mock/cyber'
import { extractText } from '@/lib/pdf'
import { supabase } from '@/lib/supabase'

/**
 * Service du module Cybersécurité — pipeline documentaire :
 * documents (Supabase Storage) → synthèse IA (`/api/synthesis`) → audit
 * (`/api/audit`, score CVSS local) → rapport (Supabase `audit_reports`).
 * Repli mock de bout en bout sans Supabase/LLM (mode démo).
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

// ---------------------------------------------------------------------------
// Documents (Sources)
// ---------------------------------------------------------------------------

function kindOf(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return ext || 'doc'
}

interface DocRow {
  id: string
  name: string
  status: string
  content: string | null
}

/** Téléverse un document : extraction texte → Storage → table (ou local en démo). */
export async function uploadDocument(file: File, clientId = 'me'): Promise<AuditDocument> {
  const content = await extractText(file)
  const status = /\.(env|pem|key)$/i.test(file.name) ? 'warn' : 'ok'
  const statusLabel = status === 'warn' ? 'sensible' : 'indexé'
  if (!supabase) {
    return { id: `local-${Date.now()}`, name: file.name, status, statusLabel, content }
  }
  const path = `${clientId}/${Date.now()}-${file.name}`
  await supabase.storage.from('audit-docs').upload(path, file, { upsert: true })
  const { data } = await supabase
    .from('audit_documents')
    .insert({
      client_id: clientId,
      name: file.name,
      path,
      kind: kindOf(file.name),
      status,
      content,
    })
    .select()
    .single()
  const id = (data as { id?: string } | null)?.id ?? `doc-${Date.now()}`
  return { id, name: file.name, status, statusLabel, content }
}

/** Liste les documents ingérés (repli mock en démo). */
export async function listDocuments(clientId: string): Promise<AuditDocument[]> {
  if (!supabase) {
    return delay(AUDIT_SOURCES.map((s) => ({ ...s, content: '' })))
  }
  const { data, error } = await supabase
    .from('audit_documents')
    .select('id, name, status, content')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })
  if (error || !data) return []
  return (data as DocRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    status: r.status === 'warn' ? 'warn' : 'ok',
    statusLabel: r.status === 'warn' ? 'sensible' : 'indexé',
    content: r.content ?? '',
  }))
}

/** Supprime un document (no-op en démo). */
export async function removeDocument(id: string): Promise<void> {
  if (!supabase) return
  await supabase.from('audit_documents').delete().eq('id', id)
}

// ---------------------------------------------------------------------------
// Pipeline (synthèse → audit)
// ---------------------------------------------------------------------------

function docPayload(documents: AuditDocument[]) {
  return documents.map((d) => ({ name: d.name, content: d.content }))
}

export interface SynthesisInput {
  documents: AuditDocument[]
  notes?: string
}

/** Résultat de synthèse + éventuel avertissement (repli mock + raison). */
export interface SynthesisResult {
  data: AuditSynthesis
  warning?: string
}

/** Synthèse IA des documents ; repli mock + raison si LLM/réseau indisponible. */
export async function runSynthesis(input: SynthesisInput): Promise<SynthesisResult> {
  try {
    const res = await fetch('/api/synthesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({ documents: docPayload(input.documents), notes: input.notes }),
    })
    if (!res.ok) return { data: AUDIT_SYNTHESIS, warning: `HTTP ${res.status}` }
    const body = (await res.json()) as Partial<AuditSynthesis> & {
      fallback?: boolean
      reason?: string
    }
    if (body.fallback || !body.synthesis) {
      return { data: AUDIT_SYNTHESIS, warning: body.reason ?? 'indisponible' }
    }
    return {
      data: {
        synthesis: body.synthesis,
        questions: body.questions ?? [],
        topology: body.topology ?? AUDIT_SYNTHESIS.topology,
      },
    }
  } catch {
    return { data: AUDIT_SYNTHESIS, warning: 'réseau' }
  }
}

export interface AuditInput {
  synthesis?: string
  documents?: AuditDocument[]
  checks?: string[]
  notes?: string
}

/** Résultat d'audit + éventuel avertissement (repli mock + raison). */
export interface AuditRunResult {
  data: AuditResult
  warning?: string
}

/** Lance l'audit via `/api/audit` ; repli mock + raison si indisponible. */
export async function runAudit(input: AuditInput): Promise<AuditRunResult> {
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({
        synthesis: input.synthesis,
        documents: docPayload(input.documents ?? []),
        checks: input.checks,
        notes: input.notes,
      }),
    })
    if (!res.ok) return { data: MOCK_RESULT, warning: `HTTP ${res.status}` }
    const body = (await res.json()) as Partial<AuditResult> & {
      fallback?: boolean
      reason?: string
    }
    if (body.fallback || !body.vulnerabilities?.length) {
      return { data: MOCK_RESULT, warning: body.reason ?? 'indisponible' }
    }
    return { data: { scores: body.scores ?? [], vulnerabilities: body.vulnerabilities } }
  } catch {
    return { data: MOCK_RESULT, warning: 'réseau' }
  }
}

// ---------------------------------------------------------------------------
// Rapports
// ---------------------------------------------------------------------------

interface ReportRow {
  id: string
  scores: AuditScore[]
  vulnerabilities: Vulnerability[]
  created_at: string
}

export async function saveReport(
  result: AuditResult,
  meta: { synthesis?: string; documents?: string[] },
  clientId = 'me',
): Promise<void> {
  if (!supabase) return
  await supabase.from('audit_reports').insert({
    client_id: clientId,
    scores: result.scores,
    vulnerabilities: result.vulnerabilities,
    synthesis: meta.synthesis ?? null,
    documents: meta.documents ?? [],
  })
}

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
