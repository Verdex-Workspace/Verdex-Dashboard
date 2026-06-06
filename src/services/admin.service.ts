import type { InfraData } from '@/types'
import { COMPOSE_PREVIEW, CONTAINERS, PORTS, SCRIPTS } from '@/data/mock/admin'

/**
 * Service du module Admin / Infra.
 *
 * Aujourd'hui : données mock. Demain : API Docker (conteneurs, ressources),
 * inventaire de ports et lecture des package.json, sans changer le contrat.
 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchInfra(_clientId: string): Promise<InfraData> {
  return delay({
    ports: PORTS,
    containers: CONTAINERS,
    compose: COMPOSE_PREVIEW,
    scripts: SCRIPTS,
  })
}
