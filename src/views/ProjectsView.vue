<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBox, VChip, VFrame, VIconBox, VSheetHeader, VSpark, VTabs } from '@/components/ui'
import { fetchTools } from '@/services/projects.service'
import { useUiStore } from '@/stores/ui'
import { useDetailStore } from '@/stores/detail'
import ToolDetailPanel from './projects/ToolDetailPanel.vue'
import type { Environment, StatusKind, Tool } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)
const detail = useDetailStore()

const ENV_KIND: Record<Environment, StatusKind> = { prod: 'ok', staging: 'warn', dev: 'info' }
const STATUS_COLOR: Record<string, string> = {
  ok: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}

const tools = ref<Tool[]>([])
const loading = ref(true)
const view = ref('grid')
const query = ref('')

async function load() {
  loading.value = true
  tools.value = await fetchTools(activeClient.value.id)
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return tools.value
  return tools.value.filter(
    (t) => t.name.toLowerCase().includes(q) || t.stack.toLowerCase().includes(q),
  )
})

const counts = computed(() => ({
  prod: tools.value.filter((t) => t.env === 'prod').length,
  staging: tools.value.filter((t) => t.env === 'staging').length,
  dev: tools.value.filter((t) => t.env === 'dev').length,
}))

function openTool(tool: Tool) {
  detail.open({
    icon: tool.icon,
    title: tool.name,
    sub: `${tool.stack} · ${tool.env} · v${tool.version}`,
    component: markRaw(ToolDetailPanel),
    props: { tool },
  })
}
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Module clé · panneau de détail"
      title="Projets & Outils"
      desc="État de tous vos outils par environnement. Cliquez une carte → le panneau de détail glisse depuis la droite (README, versioning, commits, PR, issues, déploiements)."
    />

    <VFrame chrome title="verdex.app / projets">
      <div
        style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 14px"
      >
        <VTabs
          v-model="view"
          :items="[
            { id: 'grid', label: 'Grille' },
            { id: 'list', label: 'Liste' },
          ]"
        />
        <div style="display: flex; gap: 6px">
          <VChip kind="ok">prod {{ counts.prod }}</VChip>
          <VChip kind="warn">staging {{ counts.staging }}</VChip>
          <VChip kind="info">dev {{ counts.dev }}</VChip>
        </div>
        <span style="flex: 1" />
        <VBox
          plain
          :min-height="32"
          style="width: 220px; display: flex; align-items: center; padding: 0 11px"
        >
          <input
            v-model="query"
            type="search"
            placeholder="⌕ rechercher un outil…"
            class="mono"
            style="
              border: 0;
              background: transparent;
              outline: none;
              color: var(--ink);
              font-size: 11px;
              width: 100%;
            "
          />
        </VBox>
      </div>

      <p v-if="loading" class="mono" style="color: var(--muted)">Chargement…</p>

      <!-- Grille -->
      <div v-else-if="view === 'grid'" class="grid3">
        <VBox
          v-for="tool in filtered"
          :key="tool.id"
          clickable
          :min-height="150"
          style="padding: 14px; display: flex; flex-direction: column; gap: 10px"
          @click="openTool(tool)"
        >
          <div style="display: flex; align-items: center; gap: 10px">
            <VIconBox>{{ tool.icon }}</VIconBox>
            <div style="min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px">
              <b
                style="
                  font-size: 13.5px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
                >{{ tool.name }}</b
              >
              <span class="mono" style="font-size: 10px; color: var(--muted)">{{
                tool.stack
              }}</span>
            </div>
            <span
              :style="{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: STATUS_COLOR[tool.status],
              }"
            />
          </div>
          <div style="display: flex; gap: 6px">
            <VChip :kind="ENV_KIND[tool.env]">{{ tool.env }}</VChip>
            <VChip>v{{ tool.version }}</VChip>
          </div>
          <VSpark :accent="tool.status === 'ok'" :height="26" :bars="18" :seed="tool.name.length" />
          <div style="display: flex; gap: 8px; margin-top: auto; align-items: center">
            <span class="mono" style="font-size: 10px; color: var(--muted)"
              >↗ {{ tool.openPrs }} PR · {{ tool.openIssues }} issues</span
            >
            <span class="mono" style="margin-left: auto; font-size: 10px; color: var(--accent)"
              >détails →</span
            >
          </div>
        </VBox>
      </div>

      <!-- Liste -->
      <div v-else style="display: flex; flex-direction: column; gap: 8px">
        <div class="legend" style="padding: 0 12px">
          <span style="width: 170px">OUTIL</span>
          <span style="width: 80px">ENV</span>
          <span style="width: 70px">VERSION</span>
          <span style="flex: 1">SANTÉ</span>
        </div>
        <VBox
          v-for="tool in filtered"
          :key="tool.id"
          plain
          clickable
          :min-height="44"
          style="display: flex; align-items: center; gap: 10px; padding: 0 12px"
          @click="openTool(tool)"
        >
          <div style="width: 170px; display: flex; align-items: center; gap: 9px">
            <VIconBox :size="26">{{ tool.icon }}</VIconBox>
            <b style="font-size: 12.5px">{{ tool.name }}</b>
          </div>
          <span style="width: 80px"
            ><VChip :kind="ENV_KIND[tool.env]">{{ tool.env }}</VChip></span
          >
          <span class="mono" style="width: 70px; font-size: 11px">v{{ tool.version }}</span>
          <span style="flex: 1"
            ><VSpark
              :accent="tool.status === 'ok'"
              :height="18"
              :bars="26"
              :seed="tool.name.length"
          /></span>
          <span class="mono" style="font-size: 10px; color: var(--accent)">détails →</span>
        </VBox>
      </div>

      <p
        v-if="!loading && !filtered.length"
        class="mono"
        style="color: var(--muted); padding: 8px 2px"
      >
        Aucun outil ne correspond à « {{ query }} ».
      </p>
    </VFrame>
  </div>
</template>
