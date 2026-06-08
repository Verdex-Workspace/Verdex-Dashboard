// ============================================================
// Endpoint d'audit de sécurité : POST /api/audit
// Pipeline : synthèse + documents → analyse LLM → findings JSON → score CVSS local.
// Auth Supabase requise. Sans LLM configuré → { fallback: true } (repli mock côté
// client). Le score est TOUJOURS recalculé localement depuis le vecteur CVSS.
// ============================================================
import type { VercelRequest, VercelResponse } from './_lib/http'
import { getBearerToken } from './_lib/http'
import { verifyUser } from './_lib/auth'
import { withCache } from './_lib/cache'
import { analyze, isLlmConfigured } from './_lib/llm'
import { cvssBaseScore, severityFromScore } from '../src/lib/cvss'

interface RawFinding {
  finding: string
  component: string
  cvssVector: string
  why: string
  how: string
  benefits: string[]
}

const SYSTEM = `Tu es un auditeur de sécurité senior. À partir d'une synthèse
d'infrastructure et de documents fournis, identifie des vulnérabilités plausibles et
concrètes.
Réponds UNIQUEMENT par un tableau JSON (aucun texte autour), chaque élément :
{ "finding": string, "component": string, "cvssVector": "CVSS:3.1/AV:.../AC:.../PR:.../UI:.../S:.../C:.../I:.../A:...", "why": string, "how": string, "benefits": string[] }.
Le vecteur CVSS v3.1 doit être complet. Maximum 8 findings, du plus grave au moins grave.`

/** Extrait le premier tableau JSON d'une réponse LLM, tolérant au texte autour. */
function parseFindings(text: string): RawFinding[] {
  try {
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end === -1) return []
    const arr = JSON.parse(text.slice(start, end + 1))
    return Array.isArray(arr) ? (arr as RawFinding[]) : []
  } catch {
    return []
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'method not allowed' })
    return
  }
  // Tout est encapsulé : une erreur d'exécution renvoie une raison visible
  // (jamais de 500 opaque).
  try {
    if (!(await verifyUser(getBearerToken(req)))) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }
    // Sans LLM configuré, on signale le repli — le client utilisera son mock.
    if (!isLlmConfigured()) {
      res
        .status(200)
        .json({ fallback: true, reason: 'not_configured', scores: [], vulnerabilities: [] })
      return
    }

    const body = (req.body ?? {}) as {
      synthesis?: string
      documents?: { name: string; content: string }[]
      checks?: string[]
      notes?: string
    }
    const synthesis = typeof body.synthesis === 'string' ? body.synthesis.slice(0, 8000) : ''
    const documents = Array.isArray(body.documents) ? body.documents.slice(0, 20) : []
    const checks = Array.isArray(body.checks) ? body.checks.slice(0, 20) : []
    const notes = typeof body.notes === 'string' ? body.notes.slice(0, 4000) : ''

    const cacheKey = `audit:${synthesis.length}:${documents.map((d) => d.name).join(',')}:${checks.join(',')}:${notes.length}`
    const result = await withCache(cacheKey, 300, async () => {
      const corpus = documents
        .map((d) => `# ${d.name}\n${(d.content ?? '').slice(0, 8_000)}`)
        .join('\n\n')
      const user = [
        `Synthèse : ${synthesis || '(aucune)'}`,
        `Contrôles demandés : ${checks.join(', ') || '(tous)'}`,
        notes ? `Notes : ${notes}` : '',
        corpus ? `Documents :\n${corpus}` : '',
      ]
        .filter(Boolean)
        .join('\n')

      const text = await analyze(SYSTEM, user)
      const findings = parseFindings(text)
      if (!findings.length) throw new Error('invalid_json')

      const vulnerabilities = findings.map((f, i) => {
        const score = cvssBaseScore(f.cvssVector ?? '')
        const sev = severityFromScore(score)
        return {
          id: `v${i + 1}`,
          severity: sev.kind,
          severityLabel: sev.label,
          cvss: score.toFixed(1),
          cvssVector: f.cvssVector,
          finding: f.finding,
          component: f.component,
          why: f.why,
          how: f.how,
          benefits: Array.isArray(f.benefits) ? f.benefits : [],
        }
      })

      const count = (k: string) => vulnerabilities.filter((v) => v.severity === k).length
      const crit = count('err')
      const high = count('warn')
      const med = count('info')
      const low = count('neutral')
      const overall = Math.max(0, Math.min(100, 100 - (crit * 15 + high * 8 + med * 3 + low)))
      const scores = [
        {
          key: 'Score sécurité',
          value: `${overall} / 100`,
          kind: overall >= 80 ? 'ok' : overall >= 60 ? 'warn' : 'err',
        },
        { key: 'Critiques', value: String(crit), kind: 'err' },
        { key: 'Élevées', value: String(high), kind: 'warn' },
        { key: 'Moyennes', value: String(med), kind: 'info' },
        { key: 'Faibles', value: String(low), kind: 'neutral' },
      ]
      return { fallback: false, scores, vulnerabilities }
    })

    res.status(200).json(result)
  } catch (e) {
    res.status(200).json({
      fallback: true,
      reason: e instanceof Error ? e.message : 'server_error',
      scores: [],
      vulnerabilities: [],
    })
  }
}
