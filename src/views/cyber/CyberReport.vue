<script setup lang="ts">
import { VBox, VChip, VFrame, VKpi } from '@/components/ui'
import type { AuditScore, Vulnerability } from '@/types'

defineProps<{ scores: AuditScore[]; vulnerabilities: Vulnerability[] }>()
defineEmits<{ open: [vulnerability: Vulnerability] }>()
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- Scores -->
    <div style="display: flex; gap: 12px; flex-wrap: wrap">
      <VKpi v-for="s in scores" :key="s.key" :label="s.key" :value="s.value" :kind="s.kind" />
    </div>

    <!-- Vulnérabilités -->
    <VFrame cap="Vulnérabilités" tag="priorisées par CVSS">
      <div class="legend" style="padding: 0 10px 6px">
        <span style="width: 80px">SÉVÉRITÉ</span>
        <span style="width: 56px">CVSS</span>
        <span style="flex: 1">FINDING</span>
        <span style="width: 110px">COMPOSANT</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px">
        <VBox
          v-for="v in vulnerabilities"
          :key="v.id"
          plain
          clickable
          :min-height="42"
          style="display: flex; align-items: center; gap: 10px; padding: 0 10px"
          @click="$emit('open', v)"
        >
          <span style="width: 80px"
            ><VChip :kind="v.severity">{{ v.severityLabel }}</VChip></span
          >
          <span
            class="mono"
            :style="{
              fontSize: '11px',
              width: '56px',
              color: v.severity === 'err' ? 'var(--err)' : 'var(--ink)',
            }"
            >{{ v.cvss }}</span
          >
          <span style="font-size: 12.5px; flex: 1; min-width: 0">{{ v.finding }}</span>
          <span class="mono" style="font-size: 10.5px; color: var(--muted); width: 110px">{{
            v.component
          }}</span>
        </VBox>
      </div>
    </VFrame>

    <!-- Export -->
    <VFrame cap="Export du rapport" tag="livrable">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <button class="btnw pri" type="button" disabled style="opacity: 0.8; cursor: not-allowed">
          ↓ PDF complet <VChip :dot="false">à venir</VChip>
        </button>
        <button class="btnw" type="button" disabled style="opacity: 0.8; cursor: not-allowed">
          ☁ Proton Drive <VChip :dot="false">à venir</VChip>
        </button>
        <button class="btnw" type="button" disabled style="opacity: 0.8; cursor: not-allowed">
          ✉ Proton Mail <VChip :dot="false">à venir</VChip>
        </button>
      </div>
      <p
        class="mono"
        style="font-size: 10px; color: var(--muted); margin-top: 10px; line-height: 1.5"
      >
        Le rapport (schémas, métriques, logs probants, plan d'action priorisé et estimation
        d'effort) sera généré puis classé dans Proton Drive et notifié par Proton Mail — même «
        point d'entrée unique » que le Ticketing. Nécessite le connecteur Proton (backend).
      </p>
    </VFrame>
  </div>
</template>
