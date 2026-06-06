<script setup lang="ts">
import { VBars, VChip, VFrame, VKpi } from '@/components/ui'
import type { Alert } from '@/types'

/** Corps du slide-over ouvert au clic sur une alerte (démo du pattern). */
defineProps<{ alert: Alert }>()
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <div style="display: flex; gap: 10px; flex-wrap: wrap">
      <VChip :kind="alert.kind">{{ alert.kind === 'err' ? 'critique' : 'avertissement' }}</VChip>
      <VChip>{{ alert.source }}</VChip>
      <VChip>{{ alert.age }}</VChip>
    </div>

    <div style="display: flex; gap: 10px">
      <VKpi label="Occurrences 24h" value="14" kind="warn" />
      <VKpi label="Première vue" value="04 min" kind="neutral" />
      <VKpi label="Impact" value="1 service" kind="err" />
    </div>

    <VFrame cap="Contexte" tag="logs corrélés">
      <VBars :widths="['100%', '92%', '70%']" />
    </VFrame>

    <VFrame cap="Remédiation suggérée" tag="runbook">
      <VBars :widths="['96%', '60%', '84%']" />
    </VFrame>
  </div>
</template>
