<script setup lang="ts">
import VSpark from './VSpark.vue'
import VChip from './VChip.vue'
import type { StatusKind } from '@/types'

/** Carte d'indicateur clé. */
const props = defineProps<{
  label: string
  value: string
  kind?: StatusKind
  spark?: boolean
}>()

const kindLabel: Record<string, string> = {
  ok: 'stable',
  warn: 'à voir',
  err: 'incident',
}
</script>

<template>
  <div class="wbox plain" style="padding: 10px 12px; flex: 1; min-width: 0">
    <span
      class="mono"
      style="
        font-size: 10px;
        color: var(--muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      "
      >{{ label }}</span
    >
    <div style="display: flex; gap: 8px; align-items: baseline; margin-top: 6px">
      <b style="font-size: 21px">{{ value }}</b>
      <VChip v-if="kind && kind !== 'neutral'" :kind="kind">{{ kindLabel[kind] ?? kind }}</VChip>
    </div>
    <VSpark
      v-if="spark"
      :accent="props.kind === 'ok'"
      :height="22"
      :bars="16"
      style="margin-top: 6px"
    />
  </div>
</template>
