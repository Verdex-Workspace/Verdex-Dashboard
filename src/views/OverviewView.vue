<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBox, VButton, VChip, VFrame, VIconBox, VKpi, VSheetHeader } from '@/components/ui'
import { fetchOverview, type OverviewData } from '@/services/overview.service'
import { useUiStore } from '@/stores/ui'
import { useDetailStore } from '@/stores/detail'
import AlertDetailPanel from './overview/AlertDetailPanel.vue'
import type { Alert } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)
const detail = useDetailStore()

const data = ref<OverviewData | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  data.value = await fetchOverview(activeClient.value.id)
  loading.value = false
}

onMounted(load)
watch(() => activeClient.value.id, load)

const healthDots = computed(() => Array.from({ length: 11 }, (_, i) => i < 9))

function openAlert(alert: Alert) {
  detail.open({
    icon: '⚠',
    title: `${alert.source} · ${alert.message}`,
    sub: `${alert.kind.toUpperCase()} · ${alert.age}`,
    component: markRaw(AlertDetailPanel),
    props: { alert },
  })
}
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Écran d'accueil"
      title="Vue d'ensemble"
      desc="Le matin, en 5 secondes : santé globale des outils, alertes, tickets urgents et automations échouées."
    />

    <template v-if="data">
      <!-- KPIs -->
      <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap">
        <VKpi
          v-for="kpi in data.kpis"
          :key="kpi.key"
          :label="kpi.key"
          :value="kpi.value"
          :kind="kpi.kind"
          :spark="kpi.spark"
        />
      </div>

      <div class="grid2">
        <!-- Flux d'alertes -->
        <VFrame cap="Flux d'alertes" tag="temps réel">
          <div style="display: flex; flex-direction: column; gap: 9px">
            <VBox
              v-for="alert in data.alerts"
              :key="alert.id"
              plain
              clickable
              :min-height="44"
              style="padding: 9px 11px; display: flex; align-items: center; gap: 10px"
              @click="openAlert(alert)"
            >
              <VChip :kind="alert.kind">{{ alert.kind === 'err' ? 'critique' : 'warn' }}</VChip>
              <span style="font-size: 12.5px">{{ alert.source }} · {{ alert.message }}</span>
              <span class="mono" style="margin-left: auto; font-size: 9.5px; color: var(--muted)">{{
                alert.age
              }}</span>
            </VBox>
          </div>
        </VFrame>

        <!-- Automations échouées -->
        <VFrame cap="Automations échouées" tag="n8n · Make">
          <div style="display: flex; flex-direction: column; gap: 9px">
            <VBox
              v-for="run in data.automations"
              :key="run.id"
              plain
              :min-height="44"
              style="padding: 9px 11px; display: flex; align-items: center; gap: 10px"
            >
              <VIconBox :size="26">⌬</VIconBox>
              <div style="display: flex; flex-direction: column; gap: 3px">
                <span style="font-size: 12.5px">{{ run.name }}</span>
                <span class="mono" style="font-size: 9.5px; color: var(--err)">{{ run.last }}</span>
              </div>
              <VButton style="margin-left: auto">rejouer</VButton>
            </VBox>
          </div>
        </VFrame>
      </div>

      <div style="height: 16px" />

      <div class="grid2">
        <!-- Tickets urgents -->
        <VFrame cap="Tickets urgents" tag="cross-projets">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <VBox
              v-for="ticket in data.tickets"
              :key="ticket.id"
              plain
              :min-height="34"
              style="display: flex; align-items: center; gap: 9px; padding: 0 10px"
            >
              <VChip :kind="ticket.priority === 'P1' ? 'err' : 'warn'">{{ ticket.priority }}</VChip>
              <span style="font-size: 12.5px">{{ ticket.title }}</span>
              <span style="margin-left: auto"
                ><VChip>{{ ticket.age }}</VChip></span
              >
            </VBox>
          </div>
        </VFrame>

        <!-- Santé + activité -->
        <VFrame cap="Santé des outils" tag="11 outils">
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px">
            <span
              v-for="(online, i) in healthDots"
              :key="i"
              :style="{
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                border: '1px solid var(--line)',
                background: online
                  ? 'color-mix(in oklab, var(--accent) 28%, var(--fill))'
                  : 'color-mix(in oklab, var(--err) 35%, var(--fill))',
              }"
            />
          </div>
          <div class="legend">
            <span>● en ligne 9</span>
            <span>● incident 2</span>
          </div>
          <div class="divider" style="margin: 14px 0" />
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div
              v-for="entry in data.activity"
              :key="entry.id"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span
                style="width: 7px; height: 7px; border-radius: 50%; background: var(--accent)"
              />
              <span class="mono" style="font-size: 11px; color: var(--muted)">{{
                entry.label
              }}</span>
            </div>
          </div>
        </VFrame>
      </div>
    </template>

    <p v-else-if="loading" class="mono" style="color: var(--muted); padding: 40px 0">Chargement…</p>
  </div>
</template>
