<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBox, VButton, VChip, VFrame, VSheetHeader, VTabs } from '@/components/ui'
import { fetchInfra } from '@/services/admin.service'
import { useUiStore } from '@/stores/ui'
import type { InfraData } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)

const STATUS_COLOR: Record<string, string> = {
  ok: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

const data = ref<InfraData | null>(null)
const loading = ref(true)
const view = ref('ports')

async function load() {
  loading.value = true
  data.value = await fetchInfra(activeClient.value.id)
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Admin · infrastructure"
      title="Admin / Infra"
      desc="Le sous-bassement technique : ports utilisés et leur exposition, configurations Docker (conteneurs, images, ressources), et scripts package.json de chaque projet."
    />

    <div style="margin-bottom: 14px">
      <VTabs
        v-model="view"
        :items="[
          { id: 'ports', label: 'Ports' },
          { id: 'docker', label: 'Docker' },
          { id: 'scripts', label: 'Scripts' },
        ]"
      />
    </div>

    <VFrame v-if="data" chrome :title="`verdex.app / admin / ${view}`">
      <!-- Ports -->
      <div v-if="view === 'ports'" style="display: flex; flex-direction: column; gap: 6px">
        <div class="legend" style="padding: 0 10px">
          <span style="width: 60px">PORT</span>
          <span style="flex: 1">SERVICE</span>
          <span style="width: 70px">PROTO</span>
          <span style="width: 90px">EXPOSITION</span>
          <span style="width: 50px">ÉTAT</span>
        </div>
        <VBox
          v-for="p in data.ports"
          :key="p.port"
          plain
          :min-height="40"
          style="display: flex; align-items: center; gap: 10px; padding: 0 10px"
        >
          <span class="mono" style="font-size: 12.5px; width: 60px; color: var(--accent)">{{
            p.port
          }}</span>
          <span style="font-size: 12.5px; flex: 1">{{ p.service }}</span>
          <span class="mono" style="font-size: 10.5px; color: var(--muted); width: 70px">{{
            p.proto
          }}</span>
          <span style="width: 90px"
            ><VChip :kind="p.exposure === 'public' ? 'warn' : 'neutral'">{{
              p.exposure
            }}</VChip></span
          >
          <span style="width: 50px">
            <span
              :style="{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                display: 'inline-block',
                background: STATUS_COLOR[p.status],
              }"
            />
          </span>
        </VBox>
        <p class="mono" style="font-size: 10.5px; color: var(--warn); margin-top: 6px">
          ⚠ 5432 (Postgres) exposé en public — remonté en alerte ici et dans l'audit sécurité.
        </p>
      </div>

      <!-- Docker -->
      <div v-else-if="view === 'docker'" class="grid2">
        <VFrame cap="Conteneurs" :tag="`${data.containers.length} actifs`">
          <div style="display: flex; flex-direction: column; gap: 6px">
            <VBox
              v-for="c in data.containers"
              :key="c.name"
              plain
              :min-height="48"
              style="display: flex; align-items: center; gap: 10px; padding: 0 11px"
            >
              <span
                :style="{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: STATUS_COLOR[c.status],
                }"
              />
              <div style="display: flex; flex-direction: column; gap: 2px">
                <b style="font-size: 12.5px">{{ c.name }}</b>
                <span class="mono" style="font-size: 9.5px; color: var(--muted)">{{
                  c.image
                }}</span>
              </div>
              <span
                class="mono"
                :style="{
                  marginLeft: 'auto',
                  fontSize: '10.5px',
                  color: c.status === 'warn' ? 'var(--warn)' : 'var(--muted)',
                }"
                >CPU {{ c.cpu }} · {{ c.memory }}</span
              >
            </VBox>
          </div>
        </VFrame>
        <VFrame cap="docker-compose.yml" tag="aperçu">
          <VBox plain :min-height="210" style="padding: 14px">
            <div style="display: flex; flex-direction: column; gap: 5px">
              <span
                v-for="(line, i) in data.compose"
                :key="i"
                class="mono"
                :style="{
                  fontSize: '11px',
                  color: line.startsWith('  ') ? 'var(--muted)' : 'var(--ink)',
                  paddingLeft: line.startsWith('  ') ? '14px' : '0',
                }"
                >{{ line }}</span
              >
            </div>
          </VBox>
        </VFrame>
      </div>

      <!-- Scripts -->
      <div v-else class="grid3">
        <VFrame v-for="g in data.scripts" :key="g.project" :cap="g.project" tag="package.json">
          <div style="display: flex; flex-direction: column; gap: 7px">
            <div
              v-for="s in g.scripts"
              :key="s"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span class="mono" style="font-size: 11.5px; flex: 1">pnpm run {{ s }}</span>
              <VButton>▸</VButton>
            </div>
          </div>
        </VFrame>
        <p class="mono" style="grid-column: 1 / -1; font-size: 10.5px; color: var(--muted)">
          Lancement d'un script à distance (avec confirmation), sortie streamée dans un terminal
          intégré — à brancher via le backend.
        </p>
      </div>
    </VFrame>
  </div>
</template>
