import type { Workflow } from '@/types'

/** Données mock du module Automations (remplacées plus tard par les API n8n/Make/Zapier). */

export const WORKFLOWS: Workflow[] = [
  {
    id: 'sync-crm',
    name: 'Sync CRM → Sheets',
    engine: 'n8n',
    status: 'err',
    last: 'exit 1 · timeout',
    nodes: [
      { id: 0, x: 6, y: 42, type: 'Trigger', label: 'Webhook CRM' },
      { id: 1, x: 27, y: 42, type: 'Filtre', label: 'statut = gagné' },
      { id: 2, x: 48, y: 18, type: 'HTTP', label: 'GET contact' },
      { id: 3, x: 48, y: 66, type: 'Set', label: 'format ligne' },
      { id: 4, x: 70, y: 42, type: 'Sheets', label: 'append row' },
      { id: 5, x: 90, y: 42, type: 'Slack', label: 'notifie #sales' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ],
    logs: [
      { time: '00:00.0', node: 'Trigger', status: 'ok', detail: 'payload reçu (CRM)' },
      { time: '00:00.4', node: 'Filtre', status: 'ok', detail: '1/3 passent' },
      { time: '00:01.1', node: 'HTTP GET', status: 'ok', detail: '200 · 320ms' },
      { time: '00:02.0', node: 'Sheets append', status: 'err', detail: 'timeout après 30s' },
      { time: '00:02.0', node: 'Slack', status: 'skip', detail: 'non atteint' },
    ],
  },
  {
    id: 'relance-factures',
    name: 'Relance factures',
    engine: 'make',
    status: 'warn',
    last: 'auth expirée',
    nodes: [
      { id: 0, x: 8, y: 50, type: 'Trigger', label: 'Cron J+7' },
      { id: 1, x: 34, y: 50, type: 'Filtre', label: 'impayées' },
      { id: 2, x: 62, y: 50, type: 'Email', label: 'relance client' },
      { id: 3, x: 90, y: 50, type: 'Log', label: 'historise' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ],
    logs: [
      { time: '00:00.0', node: 'Trigger', status: 'ok', detail: 'cron déclenché' },
      { time: '00:00.3', node: 'Filtre', status: 'ok', detail: '4 factures impayées' },
      { time: '00:00.9', node: 'Email', status: 'err', detail: 'auth SMTP expirée' },
      { time: '00:00.9', node: 'Log', status: 'skip', detail: 'non atteint' },
    ],
  },
  {
    id: 'onboarding',
    name: 'Onboarding client',
    engine: 'n8n',
    status: 'ok',
    last: 'OK · 2 min',
    nodes: [
      { id: 0, x: 8, y: 50, type: 'Trigger', label: 'nouveau client' },
      { id: 1, x: 30, y: 50, type: 'Set', label: 'prépare dossier' },
      { id: 2, x: 52, y: 30, type: 'Drive', label: 'crée dossier' },
      { id: 3, x: 52, y: 70, type: 'Mail', label: 'bienvenue' },
      { id: 4, x: 82, y: 50, type: 'Slack', label: 'notifie #ops' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
    logs: [
      { time: '00:00.0', node: 'Trigger', status: 'ok', detail: 'client créé' },
      { time: '00:00.5', node: 'Set', status: 'ok', detail: 'dossier préparé' },
      { time: '00:01.2', node: 'Drive', status: 'ok', detail: 'dossier créé' },
      { time: '00:01.4', node: 'Mail', status: 'ok', detail: 'envoyé' },
      { time: '00:02.0', node: 'Slack', status: 'ok', detail: 'notifié' },
    ],
  },
  {
    id: 'slack-alertes',
    name: 'Slack alertes prod',
    engine: 'zapier',
    status: 'ok',
    last: 'OK · live',
    nodes: [
      { id: 0, x: 10, y: 50, type: 'Trigger', label: 'alerte prod' },
      { id: 1, x: 50, y: 50, type: 'Filtre', label: 'sévérité ≥ warn' },
      { id: 2, x: 88, y: 50, type: 'Slack', label: 'poste #incidents' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
    ],
    logs: [
      { time: '00:00.0', node: 'Trigger', status: 'ok', detail: 'alerte reçue' },
      { time: '00:00.2', node: 'Filtre', status: 'ok', detail: 'sévérité = err' },
      { time: '00:00.4', node: 'Slack', status: 'ok', detail: 'posté' },
    ],
  },
]
