// ============================================================
// Endpoint de synthèse documentaire : POST /api/synthesis
// Entrée : { documents: [{ name, content }], notes } → synthèse IA + questions
// suggérées + topologie (serveurs/réseaux/ports). Auth Supabase requise.
// Sans LLM configuré → { fallback: true } (repli mock côté client).
// ============================================================
import type { VercelRequest, VercelResponse } from './_lib/http.js'
import { getBearerToken } from './_lib/http.js'
import { verifyUser } from './_lib/auth.js'
import { withCache } from './_lib/cache.js'
import { analyze, isLlmConfigured } from './_lib/llm.js'

interface DocIn {
  name: string
  content: string
}

const SYSTEM = `Tu es un analyste sécurité. À partir de documents d'infrastructure
(configs, diagrammes, README, .env, docker-compose…), produis une synthèse claire
puis extrais la topologie. Réponds UNIQUEMENT par un objet JSON (aucun texte autour) :
{ "synthesis": string (5-10 phrases), "questions": string[] (4 questions d'audit
pertinentes), "topology": { "servers": string[], "networks": string[], "ports": string[] } }.`

function parseJson<T>(text: string): T | null {
  try {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1) return null
    return JSON.parse(text.slice(start, end + 1)) as T
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'method not allowed' })
    return
  }
  // Tout est encapsulé : une erreur d'exécution renvoie une raison visible
  // (jamais de 500 opaque). En cas d'échec LLM (rate-limit, parse…), on lève
  // dans le producteur → withCache ne met rien en cache et on renvoie la raison.
  try {
    if (!(await verifyUser(getBearerToken(req)))) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }
    if (!isLlmConfigured()) {
      res.status(200).json({ fallback: true, reason: 'not_configured' })
      return
    }

    const body = (req.body ?? {}) as { documents?: DocIn[]; notes?: string }
    const documents = Array.isArray(body.documents) ? body.documents.slice(0, 20) : []
    const notes = typeof body.notes === 'string' ? body.notes.slice(0, 4000) : ''

    const key = `synth:${documents.map((d) => d.name).join(',')}:${notes.length}`
    const result = await withCache(key, 300, async () => {
      const corpus = documents
        .map((d) => `# ${d.name}\n${(d.content ?? '').slice(0, 12_000)}`)
        .join('\n\n')
      const user = [notes ? `Notes : ${notes}` : '', 'Documents :', corpus || '(aucun)'].join('\n')
      const text = await analyze(SYSTEM, user)
      const parsed = parseJson<{ synthesis: string; questions: string[]; topology: unknown }>(text)
      if (!parsed) throw new Error('invalid_json')
      const t = (parsed.topology ?? {}) as Record<string, unknown>
      const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : [])
      return {
        fallback: false,
        synthesis: String(parsed.synthesis ?? ''),
        questions: arr(parsed.questions),
        topology: { servers: arr(t.servers), networks: arr(t.networks), ports: arr(t.ports) },
      }
    })
    res.status(200).json(result)
  } catch (e) {
    res.status(200).json({
      fallback: true,
      reason: e instanceof Error ? e.message : 'server_error',
    })
  }
}
