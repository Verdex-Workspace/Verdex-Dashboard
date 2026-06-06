/**
 * Types partagés du Verdex Dashboard.
 */

/** Niveau de statut générique, réutilisé partout (chips, points de santé…). */
export type StatusKind = 'ok' | 'warn' | 'err' | 'info' | 'neutral'

/** Environnement de déploiement d'un outil. */
export type Environment = 'prod' | 'staging' | 'dev'

/** Client / espace de travail sélectionnable dans la sidebar. */
export interface Client {
  id: string
  name: string
  sub: string
  avatar: string
}

/** Élément de navigation. */
export interface NavItem {
  id: string
  icon: string
  label: string
  shortcut?: string
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

/** Indicateur clé (KPI). */
export interface Kpi {
  key: string
  value: string
  kind?: StatusKind
  spark?: boolean
}

/** Alerte temps réel. */
export interface Alert {
  id: string
  kind: StatusKind
  source: string
  message: string
  age: string
}

/** Exécution d'automation. */
export interface AutomationRun {
  id: string
  name: string
  engine: 'n8n' | 'make' | 'zapier'
  status: StatusKind
  last: string
}

/** Ticket (résumé). */
export interface Ticket {
  id: string
  title: string
  priority: 'P1' | 'P2' | 'P3'
  age: string
}

/** Entrée d'activité récente (git / deploy). */
export interface ActivityEntry {
  id: string
  label: string
}
