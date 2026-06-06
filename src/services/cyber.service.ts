import type { AuditData } from '@/types'
import {
  AUDIT_CHECKS,
  AUDIT_QUESTIONS,
  AUDIT_SCORES,
  AUDIT_SOURCES,
  VULNERABILITIES,
} from '@/data/mock/cyber'

/**
 * Service du module Cybersécurité.
 *
 * Aujourd'hui : données mock. Demain : pipeline réel (analyse IA des sources,
 * génération de schémas, scan, rapport CVSS) via un backend dédié.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchAudit(_clientId: string): Promise<AuditData> {
  return delay({
    sources: AUDIT_SOURCES,
    questions: AUDIT_QUESTIONS,
    checks: AUDIT_CHECKS,
    scores: AUDIT_SCORES,
    vulnerabilities: VULNERABILITIES,
  })
}
