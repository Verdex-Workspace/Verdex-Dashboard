import type { ProtonData } from '@/types'
import {
  PROTON_AUTH,
  PROTON_CALENDAR,
  PROTON_DOCS,
  PROTON_DRIVE,
  PROTON_KPIS,
  PROTON_MAIL,
  PROTON_PASS,
} from '@/data/mock/proton'

/**
 * Service du module Proton Unlimited.
 *
 * Aujourd'hui : données mock. Demain : remontées temps réel via le connecteur
 * Proton (Bridge IMAP/SMTP, CalDAV…) — lecture seule, sans dupliquer la donnée.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchProton(_clientId: string): Promise<ProtonData> {
  return delay({
    kpis: PROTON_KPIS,
    mail: PROTON_MAIL,
    calendar: PROTON_CALENDAR,
    pass: PROTON_PASS,
    auth: PROTON_AUTH,
    drive: PROTON_DRIVE,
    docs: PROTON_DOCS,
  })
}
