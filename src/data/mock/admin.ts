import type { Container, Port, ScriptGroup } from '@/types'

/** Données mock du module Admin / Infra (remplacées plus tard par l'API Docker/infra). */

export const PORTS: Port[] = [
  { port: 4012, service: 'novaweb-api', proto: 'HTTP', exposure: 'interne', status: 'ok' },
  { port: 443, service: 'traefik', proto: 'HTTPS', exposure: 'public', status: 'ok' },
  { port: 5432, service: 'postgres', proto: 'TCP', exposure: 'public', status: 'err' },
  { port: 6379, service: 'redis', proto: 'TCP', exposure: 'interne', status: 'ok' },
  { port: 5173, service: 'verdex-dashboard', proto: 'HTTP', exposure: 'interne', status: 'ok' },
  { port: 9090, service: 'prometheus', proto: 'HTTP', exposure: 'interne', status: 'warn' },
]

export const CONTAINERS: Container[] = [
  { name: 'traefik', image: 'traefik:v3', status: 'ok', cpu: '0.4%', memory: '62 Mo' },
  { name: 'novaweb-api', image: 'node:20-alpine', status: 'ok', cpu: '3.1%', memory: '180 Mo' },
  { name: 'billing', image: 'node:20-alpine', status: 'warn', cpu: '12%', memory: '420 Mo' },
  { name: 'postgres', image: 'postgres:16', status: 'ok', cpu: '5.5%', memory: '1.2 Go' },
  { name: 'redis', image: 'redis:7', status: 'ok', cpu: '0.2%', memory: '40 Mo' },
]

export const COMPOSE_PREVIEW: string[] = [
  'services:',
  '  traefik:',
  "    ports: ['443:443']",
  '  novaweb-api:',
  '    depends_on: [postgres]',
  '  postgres:',
  '    volumes: [pgdata]',
  '  redis:',
  "    command: ['redis-server']",
]

export const SCRIPTS: ScriptGroup[] = [
  { project: 'novaweb-api', scripts: ['dev', 'build', 'start', 'test', 'migrate', 'lint'] },
  { project: 'verdex-dashboard', scripts: ['dev', 'build', 'preview', 'lint', 'test', 'test:e2e'] },
  { project: 'billing-service', scripts: ['dev', 'build', 'test:cov', 'seed'] },
]
