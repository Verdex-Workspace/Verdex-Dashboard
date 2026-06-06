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

/* ============================================================
   Module Projets & Outils
   ============================================================ */

/** Outil / projet suivi dans le dashboard (résumé carte). */
export interface Tool {
  id: string
  name: string
  env: Environment
  status: StatusKind
  version: string
  stack: string
  icon: string
  /** nombre de PR ouvertes / issues ouvertes (résumé carte) */
  openPrs: number
  openIssues: number
}

/** Dépendance d'un outil. */
export interface Dependency {
  name: string
  upToDate: boolean
}

/** Lien externe d'un outil. */
export interface ToolLink {
  label: string
  url: string
}

/** Commit (résumé). */
export interface Commit {
  hash: string
  message: string
  age: string
}

/** Pull request (résumé). */
export interface PullRequest {
  id: string
  title: string
  status: StatusKind
  detail: string
}

/** Issue (résumé). */
export interface Issue {
  id: string
  kind: StatusKind
  title: string
  meta: string
}

/** Déploiement (résumé). */
export interface Deployment {
  env: Environment
  version: string
  when: string
  status: StatusKind
}

/** KPI technique d'un outil. */
export interface ToolMetric {
  key: string
  value: string
  kind: StatusKind
}

/** Détail complet d'un outil (panneau slide-over). */
export interface ToolDetail {
  id: string
  port: number
  description: string
  metrics: ToolMetric[]
  dependencies: Dependency[]
  links: ToolLink[]
  commits: Commit[]
  pullRequests: PullRequest[]
  issues: Issue[]
  deployments: Deployment[]
}

/* ============================================================
   Module Logs & Métriques
   ============================================================ */

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'

/** Ligne de log agrégée. */
export interface LogEntry {
  id: string
  time: string
  level: LogLevel
  source: string
  message: string
}

/** Mini graphe d'observabilité (carte). */
export interface MetricChart {
  key: string
  source: string
  /** true = courbe « saine » (accent), false = anormale */
  healthy: boolean
}

/** Données du module Logs & Métriques. */
export interface LogsData {
  sources: string[]
  kpis: Kpi[]
  charts: MetricChart[]
  entries: LogEntry[]
}
