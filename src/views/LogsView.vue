<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VChip, VFrame, VKpi, VSheetHeader, VSpark, VTabs } from '@/components/ui'
import { fetchLogs } from '@/services/logs.service'
import { useUiStore } from '@/stores/ui'
import type { LogLevel, LogsData, StatusKind } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)

const LEVEL_KIND: Record<LogLevel, StatusKind> = {
  ERROR: 'err',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'neutral',
}

const data = ref<LogsData | null>(null)
const loading = ref(true)
const view = ref('unifie')
const source = ref('Loki')
const queryText = ref('')

async function load() {
  loading.value = true
  data.value = await fetchLogs(activeClient.value.id)
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)

const entries = computed(() => {
  if (!data.value) return []
  let list = data.value.entries
  if (view.value === 'source') list = list.filter((e) => e.source === source.value)
  const q = queryText.value.trim().toLowerCase()
  if (q) list = list.filter((e) => e.message.toLowerCase().includes(q))
  return list
})

function pickSource(s: string) {
  view.value = 'source'
  source.value = s
}
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Observabilité · agrégation"
      title="Logs & Métriques"
      desc="Toutes vos sources branchées au même endroit : Grafana, Prometheus, Loki, Traefik, Docker, Vercel, Supabase, PostgreSQL, GitHub Actions. Vue unifiée ou drill-down par source."
    />

    <template v-if="data">
      <div
        style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 14px"
      >
        <VTabs
          v-model="view"
          :items="[
            { id: 'unifie', label: 'Unifié' },
            { id: 'source', label: 'Par source' },
          ]"
        />
        <span class="mono" style="font-size: 11px; color: var(--muted)">connecteurs :</span>
        <div style="display: flex; gap: 6px; flex-wrap: wrap">
          <span v-for="s in data.sources" :key="s" style="cursor: pointer" @click="pickSource(s)">
            <VChip :kind="view === 'source' && source === s ? 'ok' : 'neutral'">{{ s }}</VChip>
          </span>
        </div>
      </div>

      <VFrame chrome :title="`verdex.app / logs${view === 'source' ? ' / ' + source : ''}`">
        <!-- KPIs -->
        <div style="display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap">
          <VKpi
            v-for="kpi in data.kpis"
            :key="kpi.key"
            :label="kpi.key"
            :value="kpi.value"
            :kind="kpi.kind"
            :spark="kpi.spark"
          />
        </div>

        <!-- Mini graphes -->
        <div class="grid3" style="margin-bottom: 14px">
          <VFrame v-for="c in data.charts" :key="c.key" :cap="c.key" :tag="c.source">
            <VSpark :accent="c.healthy" :height="48" :bars="28" :seed="c.key.length" />
          </VFrame>
        </div>

        <!-- Flux de logs -->
        <VFrame cap="Flux de logs" :tag="view === 'unifie' ? 'toutes sources' : source">
          <div class="legend" style="margin-bottom: 8px; padding: 0 4px">
            <span style="color: var(--err)">● ERROR</span>
            <span style="color: var(--warn)">● WARN</span>
            <span style="color: var(--info)">● INFO</span>
            <span>● DEBUG</span>
            <span style="margin-left: auto">live ▸ filtrage type Loki/LogQL</span>
          </div>

          <div style="margin-bottom: 8px">
            <input
              v-model="queryText"
              type="search"
              placeholder='{source="traefik"} |= "502"'
              class="mono"
              style="
                width: 100%;
                border: 1px solid var(--line);
                border-radius: 8px;
                background: var(--paper2);
                color: var(--ink);
                font-size: 11px;
                padding: 7px 10px;
                outline: none;
              "
            />
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px">
            <div
              v-for="e in entries"
              :key="e.id"
              style="
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 6px 10px;
                background: var(--paper2);
                border: 1px solid var(--line-2);
                border-radius: 7px;
              "
            >
              <span class="mono" style="font-size: 10px; color: var(--muted); width: 60px">{{
                e.time
              }}</span>
              <VChip :kind="LEVEL_KIND[e.level]">{{ e.level }}</VChip>
              <span class="mono" style="font-size: 10.5px; color: var(--muted); width: 110px">{{
                e.source
              }}</span>
              <span class="mono" style="font-size: 11px">{{ e.message }}</span>
            </div>
            <p v-if="!entries.length" class="mono" style="color: var(--muted); padding: 6px 2px">
              Aucune ligne ne correspond.
            </p>
          </div>
        </VFrame>
      </VFrame>
    </template>

    <p v-else-if="loading" class="mono" style="color: var(--muted); padding: 40px 0">Chargement…</p>
  </div>
</template>
