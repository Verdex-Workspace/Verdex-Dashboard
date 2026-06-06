import type { AuthCode, CalendarEvent, DocItem, DriveFile, Kpi, MailItem } from '@/types'

/** Données mock du module Proton Unlimited (remontées — remplacées plus tard par le connecteur Proton). */

export const PROTON_KPIS: Kpi[] = [
  { key: 'Stockage Unlimited', value: '312 / 500 Go', kind: 'ok', spark: true },
  { key: 'Comptes 2FA', value: '24', kind: 'ok' },
  { key: 'Mots de passe faibles', value: '3', kind: 'warn' },
  { key: "Évènements aujourd'hui", value: '5', kind: 'ok' },
]

export const PROTON_MAIL: { unread: number; items: MailItem[] } = {
  unread: 12,
  items: [
    { id: 'm1', subject: 'Facture OVH', time: '08:12', unread: true },
    { id: 'm2', subject: 'PR review demandée', time: '07:40', unread: false },
    { id: 'm3', subject: 'Newsletter Proton', time: 'hier', unread: false },
  ],
}

export const PROTON_CALENDAR: CalendarEvent[] = [
  { id: 'e1', time: '09:30', title: 'Standup équipe', kind: 'ok' },
  { id: 'e2', time: '11:00', title: 'Audit NovaWeb', kind: 'warn' },
  { id: 'e3', time: '14:30', title: 'Revue sprint', kind: 'neutral' },
  { id: 'e4', time: '17:00', title: 'Call client GO', kind: 'neutral' },
]

export const PROTON_PASS = { count: 148, reused: 2, weak: 1 }

export const PROTON_AUTH: AuthCode[] = [
  { id: 'a1', service: 'Proton Mail', code: '482 193' },
  { id: 'a2', service: 'GitHub', code: '907 244' },
  { id: 'a3', service: 'Supabase', code: '120 668' },
  { id: 'a4', service: 'AWS root', code: '551 030' },
]

export const PROTON_DRIVE: DriveFile[] = [
  { id: 'd1', name: 'audit-novaweb.pdf', size: '2 Mo' },
  { id: 'd2', name: 'infra-diagram.drawio', size: '—' },
  { id: 'd3', name: 'sauvegarde-db.sql', size: '84 Mo' },
]

export const PROTON_DOCS: DocItem[] = [
  { id: 'doc1', name: 'Rapport audit Q2', kind: 'Doc', when: 'il y a 1 h' },
  { id: 'doc2', name: 'Suivi tickets', kind: 'Sheet', when: 'hier' },
  { id: 'doc3', name: 'Specs API v2', kind: 'Doc', when: '2 j' },
]
