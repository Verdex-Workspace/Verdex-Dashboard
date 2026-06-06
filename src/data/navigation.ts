import type { Client, NavGroup } from '@/types'

/**
 * Modèle de navigation du dashboard — groupes et modules.
 * Les `id` correspondent aux `name` des routes (voir src/router).
 */
export const NAV: NavGroup[] = [
  {
    group: 'Pilotage',
    key: 'pilotage',
    items: [
      { id: 'overview', icon: '◎', label: "Vue d'ensemble", shortcut: 'G H' },
      { id: 'projects', icon: '▤', label: 'Projets & Outils', shortcut: 'G P' },
      { id: 'performance', icon: '↗', label: 'Performance & Gains', shortcut: 'G G' },
    ],
  },
  {
    group: 'Observabilité',
    key: 'observability',
    items: [
      { id: 'logs', icon: '≋', label: 'Logs & Métriques', shortcut: 'G L' },
      { id: 'automations', icon: '⌬', label: 'Automations', shortcut: 'G A' },
    ],
  },
  {
    group: 'Delivery',
    key: 'delivery',
    items: [
      { id: 'ticketing', icon: '◧', label: 'Ticketing', shortcut: 'G T' },
      { id: 'admin', icon: '⚙', label: 'Admin / Infra', shortcut: 'G I' },
    ],
  },
  {
    group: 'Sécurité & Outils',
    key: 'security',
    items: [
      { id: 'cyber', icon: '⛨', label: 'Cybersécurité', shortcut: 'G S' },
      { id: 'proton', icon: '✦', label: 'Proton Unlimited', shortcut: 'G U' },
    ],
  },
]

/** Liste aplatie des modules (pratique pour le fil d'Ariane). */
export const NAV_FLAT = NAV.flatMap((g) => g.items)

export function labelOf(id: string): string {
  return NAV_FLAT.find((i) => i.id === id)?.label ?? id
}

/** Clients / espaces sélectionnables (mock — à brancher sur Supabase). */
export const CLIENTS: Client[] = [
  { id: 'me', name: 'Mes projets', sub: 'perso · 11 outils', avatar: '★' },
  { id: 'novaweb', name: 'NovaWeb SAS', sub: 'client · 6 outils', avatar: 'N' },
  { id: 'atelier', name: 'Atelier Mauve', sub: 'client · 3 outils', avatar: 'A' },
  { id: 'grandouest', name: 'GO Logistics', sub: 'client · 9 outils', avatar: 'G' },
]
