<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBox, VButton, VChip, VFrame, VIconBox, VSheetHeader } from '@/components/ui'
import { fetchAutomations } from '@/services/automations.service'
import { useUiStore } from '@/stores/ui'
import AutomationGraph from './automations/AutomationGraph.vue'
import type { AutomationEngine, ExecStatus, StatusKind, Workflow } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)

const ENGINE_ICON: Record<AutomationEngine, string> = { n8n: '⌬', make: '◆', zapier: '⚡' }
const STATUS_COLOR: Record<string, string> = {
  ok: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
}
const LOG_KIND: Record<ExecStatus, StatusKind> = { ok: 'ok', err: 'err', skip: 'neutral' }

const workflows = ref<Workflow[]>([])
const selectedId = ref<string>('')
const loading = ref(true)
const runIndex = ref(-1)
let timer: ReturnType<typeof setTimeout> | undefined

const selected = computed(() => workflows.value.find((w) => w.id === selectedId.value) ?? null)

async function load() {
  loading.value = true
  const data = await fetchAutomations(activeClient.value.id)
  workflows.value = data.workflows
  selectedId.value = data.workflows[0]?.id ?? ''
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)

function stopRun() {
  if (timer) clearTimeout(timer)
  runIndex.value = -1
}

function selectWorkflow(id: string) {
  stopRun()
  selectedId.value = id
}

function execute() {
  if (!selected.value) return
  const total = selected.value.nodes.length
  runIndex.value = 0
  const tick = () => {
    timer = setTimeout(() => {
      if (runIndex.value < total - 1) {
        runIndex.value++
        tick()
      } else {
        timer = setTimeout(() => (runIndex.value = -1), 900)
      }
    }, 520)
  }
  tick()
}

onBeforeUnmount(stopRun)
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Automations · n8n · Make · Zapier"
      title="Automations & Graphe"
      desc="Tous vos workflows, quel que soit le moteur. Visualisez le graphe, lancez une exécution, suivez les logs nœud par nœud, rejouez en cas d'échec."
    />

    <div
      v-if="selected"
      style="display: grid; grid-template-columns: 260px 1fr; gap: 18px; align-items: start"
    >
      <!-- Liste des workflows -->
      <VFrame cap="Workflows" :tag="String(workflows.length)">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <VBox
            v-for="w in workflows"
            :key="w.id"
            plain
            clickable
            :min-height="56"
            :style="{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderColor: w.id === selectedId ? 'var(--accent-dim)' : undefined,
            }"
            @click="selectWorkflow(w.id)"
          >
            <div style="display: flex; align-items: center; gap: 8px">
              <VIconBox :size="24">{{ ENGINE_ICON[w.engine] }}</VIconBox>
              <span style="font-size: 12.5px">{{ w.name }}</span>
              <span
                :style="{
                  marginLeft: 'auto',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: STATUS_COLOR[w.status],
                }"
              />
            </div>
            <span
              class="mono"
              :style="{
                fontSize: '9.5px',
                color: w.status === 'err' ? 'var(--err)' : 'var(--muted)',
              }"
              >{{ w.engine }} · {{ w.last }}</span
            >
          </VBox>
        </div>
      </VFrame>

      <!-- Graphe + logs -->
      <div style="display: flex; flex-direction: column; gap: 16px">
        <VFrame :cap="selected.name" :tag="selected.engine">
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px">
            <VButton primary @click="execute">▸ exécuter</VButton>
            <VButton @click="execute">rejouer le dernier</VButton>
            <span style="flex: 1" />
            <span
              class="mono"
              :style="{
                fontSize: '10.5px',
                color: runIndex >= 0 ? 'var(--accent)' : 'var(--muted)',
              }"
              >{{ runIndex >= 0 ? 'exécution en cours…' : 'inactif' }}</span
            >
          </div>
          <AutomationGraph :nodes="selected.nodes" :edges="selected.edges" :run-index="runIndex" />
        </VFrame>

        <VFrame cap="Logs d'exécution" tag="nœud par nœud">
          <div style="display: flex; flex-direction: column; gap: 5px">
            <div
              v-for="(l, i) in selected.logs"
              :key="i"
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
                l.time
              }}</span>
              <span class="mono" style="font-size: 11px; width: 120px">{{ l.node }}</span>
              <VChip :kind="LOG_KIND[l.status]">{{ l.status }}</VChip>
              <span class="mono" style="font-size: 10.5px; color: var(--muted)">{{
                l.detail
              }}</span>
            </div>
          </div>
        </VFrame>
      </div>
    </div>

    <p v-else-if="loading" class="mono" style="color: var(--muted); padding: 40px 0">Chargement…</p>
  </div>
</template>
