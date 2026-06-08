// ============================================================
// Calcul CVSS v3.1 (score de base) + sévérité — version serverless.
// ⚠️ Copie autonome de `src/lib/cvss.ts` (testé par Vitest). Garder les deux en
// phase. Duplication volontaire : les fonctions Vercel s'exécutent en ESM natif
// et ne peuvent pas importer proprement hors de `api/` — on garde donc cette
// logique dans l'arbre de la fonction. Réf. FIRST CVSS v3.1 §7.1.
// ============================================================

type SeverityKind = 'ok' | 'warn' | 'err' | 'info' | 'neutral'
type Metric = 'AV' | 'AC' | 'PR' | 'UI' | 'S' | 'C' | 'I' | 'A'

const AV: Record<string, number> = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }
const AC: Record<string, number> = { L: 0.77, H: 0.44 }
const UI: Record<string, number> = { N: 0.85, R: 0.62 }
const CIA: Record<string, number> = { H: 0.56, L: 0.22, N: 0 }
const PR_UNCHANGED: Record<string, number> = { N: 0.85, L: 0.62, H: 0.27 }
const PR_CHANGED: Record<string, number> = { N: 0.85, L: 0.68, H: 0.5 }

function parseVector(vector: string): Partial<Record<Metric, string>> {
  const out: Partial<Record<Metric, string>> = {}
  for (const part of vector.split('/')) {
    const [k, v] = part.split(':')
    if (k && v && k !== 'CVSS') out[k as Metric] = v
  }
  return out
}

function roundUp(input: number): number {
  const intInput = Math.round(input * 100000)
  if (intInput % 10000 === 0) return intInput / 100000
  return (Math.floor(intInput / 10000) + 1) / 10
}

export function cvssBaseScore(vector: string): number {
  const m = parseVector(vector)
  const scopeChanged = m.S === 'C'
  const av = AV[m.AV ?? '']
  const ac = AC[m.AC ?? '']
  const ui = UI[m.UI ?? '']
  const pr = (scopeChanged ? PR_CHANGED : PR_UNCHANGED)[m.PR ?? '']
  const c = CIA[m.C ?? '']
  const i = CIA[m.I ?? '']
  const a = CIA[m.A ?? '']
  if ([av, ac, ui, pr, c, i, a].some((x) => x === undefined)) return 0

  const iss = 1 - (1 - c) * (1 - i) * (1 - a)
  const impact = scopeChanged ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss
  if (impact <= 0) return 0

  const exploitability = 8.22 * av * ac * pr * ui
  const raw = scopeChanged
    ? Math.min(1.08 * (impact + exploitability), 10)
    : Math.min(impact + exploitability, 10)
  return roundUp(raw)
}

export function severityFromScore(score: number): { kind: SeverityKind; label: string } {
  if (score >= 9.0) return { kind: 'err', label: 'critique' }
  if (score >= 7.0) return { kind: 'warn', label: 'élevée' }
  if (score >= 4.0) return { kind: 'info', label: 'moyenne' }
  if (score > 0) return { kind: 'neutral', label: 'faible' }
  return { kind: 'neutral', label: 'nulle' }
}
