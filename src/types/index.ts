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
  /** clé i18n du groupe (navGroup.<key>) */
  key: string
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

/** Ticket urgent (résumé affiché sur la Vue d'ensemble). */
export interface UrgentTicket {
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
  /** dépôt GitHub lié, au format "owner/name" (active les données réelles) */
  repo?: string | null
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
  /** README brut (markdown) si remonté depuis GitHub */
  readme?: string | null
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

/* ============================================================
   Module Ticketing (style GitHub Projects)
   ============================================================ */

export type TicketType = 'bug' | 'feature' | 'perf' | 'chore'
export type TicketPriority = 'P1' | 'P2' | 'P3'
export type TicketStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
/** Taille façon GitHub Projects (single-select). */
export type TicketSize = 'XS' | 'S' | 'M' | 'L' | 'XL'

/** Personne assignable à un ticket. */
export interface Assignee {
  id: string
  name: string
  initials: string
  /** login GitHub (pour la synchro des assignés d'une issue liée) */
  githubLogin?: string
}

/** Étiquette de ticket. */
export interface Label {
  id: string
  name: string
  kind: StatusKind
}

/** Référence légère vers une PR ou une issue liée. */
export interface LinkedRef {
  id: string
  label: string
  /** dépôt complet `owner/name` (issues créées depuis le dashboard — pour la synchro) */
  repo?: string
  /** numéro d'issue/PR GitHub (cible de la synchro) */
  number?: number
}

/**
 * Ticket — entité centrale, fortement reliée (outil/repo, client, assigné,
 * type, priorité, effort, deadline, PR/issues liées…).
 */
export interface Ticket {
  id: string
  ref: number
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  /** charge estimée en points */
  effort: number
  /** impact 0-100 (axe de la matrice de priorisation) */
  impact: number
  toolId: string | null
  clientId: string
  assigneeId: string | null
  labels: Label[]
  /** échéance ISO (YYYY-MM-DD) — alimente la charge & la future synchro Calendar */
  deadline: string | null
  sprint: string | null
  /** jalon GitHub (texte libre) */
  milestone: string | null
  /** taille relative (XS→XL) façon GitHub Projects */
  size: TicketSize | null
  /** estimation chiffrée (jours/points), distincte de l'effort */
  estimate: number | null
  linkedPrs: LinkedRef[]
  linkedIssues: LinkedRef[]
  createdAt: string
  updatedAt: string
}

/** Élément de roadmap (barre sur un axe de mois). */
export interface RoadmapItem {
  id: string
  label: string
  startMonth: number
  span: number
  kind: StatusKind
}

/** Tâche de diagramme de Gantt (barre sur un axe de semaines). */
export interface GanttTask {
  id: string
  label: string
  startWeek: number
  span: number
  critical: boolean
}

/** Données du module Ticketing (roadmap/gantt sont dérivés des tickets, cf. derive.ts). */
export interface TicketingData {
  tickets: Ticket[]
  assignees: Assignee[]
}

/* ============================================================
   Module Cybersécurité (pipeline d'audit)
   ============================================================ */

/** Document/source ingéré pour l'audit. */
export interface AuditSource {
  id: string
  name: string
  /** ok = indexé · warn = sensible */
  status: StatusKind
  statusLabel: string
}

/** Contrôle du périmètre d'audit. */
export interface AuditCheck {
  id: string
  label: string
  enabled: boolean
}

/** Indicateur de score de l'audit. */
export interface AuditScore {
  key: string
  value: string
  kind: StatusKind
}

/** Vulnérabilité détectée (priorisée par CVSS). */
export interface Vulnerability {
  id: string
  /** err = critique · warn = élevée · info = moyenne · neutral = faible */
  severity: StatusKind
  severityLabel: string
  cvss: string
  /** vecteur CVSS v3.1 (source du score, recalculé localement) */
  cvssVector?: string
  finding: string
  component: string
  /** anatomie du finding (slide-over) */
  why: string
  how: string
  benefits: string[]
}

/** Données du module Cybersécurité. */
export interface AuditData {
  sources: AuditSource[]
  questions: string[]
  checks: AuditCheck[]
  scores: AuditScore[]
  vulnerabilities: Vulnerability[]
}

/** Résultat d'un audit (scores + vulnérabilités) renvoyé par le pipeline. */
export interface AuditResult {
  scores: AuditScore[]
  vulnerabilities: Vulnerability[]
}

/** Rapport d'audit persisté (Supabase `audit_reports`). */
export interface AuditReport extends AuditResult {
  id: string
  repo: string | null
  createdAt: string
}

/* ============================================================
   Module Automations (graphe de workflows)
   ============================================================ */

export type AutomationEngine = 'n8n' | 'make' | 'zapier'
export type ExecStatus = 'ok' | 'err' | 'skip'

/** Nœud d'un workflow (position en %). */
export interface FlowNode {
  id: number
  x: number
  y: number
  type: string
  label: string
}

/** Arête orientée entre deux nœuds. */
export interface FlowEdge {
  from: number
  to: number
}

/** Ligne de log d'exécution (nœud par nœud). */
export interface ExecLog {
  time: string
  node: string
  status: ExecStatus
  detail: string
}

/** Workflow d'automation, quel que soit le moteur. */
export interface Workflow {
  id: string
  name: string
  engine: AutomationEngine
  status: StatusKind
  last: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  logs: ExecLog[]
}

/** Données du module Automations. */
export interface AutomationsData {
  workflows: Workflow[]
}

/* ============================================================
   Module Admin / Infra
   ============================================================ */

/** Port utilisé et son exposition. */
export interface Port {
  port: number
  service: string
  proto: string
  exposure: 'public' | 'interne'
  status: StatusKind
}

/** Conteneur Docker (ressources). */
export interface Container {
  name: string
  image: string
  status: StatusKind
  cpu: string
  memory: string
}

/** Groupe de scripts package.json d'un projet. */
export interface ScriptGroup {
  project: string
  scripts: string[]
}

/** Données du module Admin / Infra. */
export interface InfraData {
  ports: Port[]
  containers: Container[]
  compose: string[]
  scripts: ScriptGroup[]
}

/* ============================================================
   Module Proton Unlimited (remontées en lecture seule)
   ============================================================ */

export interface MailItem {
  id: string
  subject: string
  time: string
  unread: boolean
}

export interface CalendarEvent {
  id: string
  time: string
  title: string
  kind: StatusKind
}

export interface AuthCode {
  id: string
  service: string
  code: string
}

export interface DriveFile {
  id: string
  name: string
  size: string
}

export interface DocItem {
  id: string
  name: string
  kind: 'Doc' | 'Sheet'
  when: string
}

/** Données du module Proton Unlimited. */
export interface ProtonData {
  kpis: Kpi[]
  mail: { unread: number; items: MailItem[] }
  calendar: CalendarEvent[]
  pass: { count: number; reused: number; weak: number }
  auth: AuthCode[]
  drive: DriveFile[]
  docs: DocItem[]
}
