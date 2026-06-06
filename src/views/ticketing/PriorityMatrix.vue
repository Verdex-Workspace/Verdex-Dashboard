<script setup lang="ts">
import { computed } from 'vue'
import { VChip, VFrame } from '@/components/ui'
import { PRIORITY_KIND, TYPE_KIND, kindColor } from './helpers'
import { priorityScore } from '@/services/ticketing.service'
import type { Ticket } from '@/types'

const props = defineProps<{ tickets: Ticket[] }>()
defineEmits<{ open: [ticket: Ticket] }>()

const MAX_EFFORT = 14

function bubbleStyle(t: Ticket) {
  const x = Math.min((t.effort / MAX_EFFORT) * 100, 96)
  const y = 100 - t.impact // impact fort → haut
  return {
    position: 'absolute' as const,
    left: `${x}%`,
    top: `${Math.min(Math.max(y, 4), 92)}%`,
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    background: `color-mix(in oklab, ${kindColor(TYPE_KIND[t.type])} 40%, var(--fill))`,
    border: `1.6px solid color-mix(in oklab, ${kindColor(TYPE_KIND[t.type])} 70%, var(--line))`,
    cursor: 'pointer',
  }
}

const ranked = computed(() =>
  [...props.tickets].sort((a, b) => priorityScore(b) - priorityScore(a)).slice(0, 6),
)
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: stretch; flex-wrap: wrap">
    <VFrame cap="Impact × Effort" tag="priorisation" style="flex: 1 1 360px">
      <div
        class="gridbg"
        style="
          position: relative;
          height: 280px;
          border: 1.5px solid var(--line);
          border-radius: 8px;
          background: var(--paper2);
        "
      >
        <span
          class="mono"
          style="position: absolute; top: 6px; left: 8px; font-size: 9px; color: var(--accent)"
          >QUICK WINS</span
        >
        <span
          class="mono"
          style="position: absolute; top: 6px; right: 8px; font-size: 9px; color: var(--muted)"
          >GROS CHANTIERS</span
        >
        <span
          class="mono"
          style="position: absolute; bottom: 6px; left: 8px; font-size: 9px; color: var(--muted)"
          >BOUCHE-TROUS</span
        >
        <span
          class="mono"
          style="position: absolute; bottom: 6px; right: 8px; font-size: 9px; color: var(--err)"
          >À ÉVITER</span
        >
        <span
          v-for="t in tickets"
          :key="t.id"
          :title="`#${t.ref} ${t.title}`"
          :style="bubbleStyle(t)"
          @click="$emit('open', t)"
        />
      </div>
      <div class="legend" style="margin-top: 8px; justify-content: space-between">
        <span>← effort faible · fort →</span>
        <span>↑ impact fort</span>
      </div>
    </VFrame>

    <VFrame cap="File priorisée" tag="impact ÷ effort" style="flex: 1 1 240px">
      <div style="display: flex; flex-direction: column; gap: 7px">
        <div
          v-for="t in ranked"
          :key="t.id"
          class="clickable"
          style="display: flex; align-items: center; gap: 8px"
          @click="$emit('open', t)"
        >
          <VChip :kind="PRIORITY_KIND[t.priority]">{{ t.priority }}</VChip>
          <span
            style="
              font-size: 12px;
              flex: 1;
              min-width: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ t.title }}</span
          >
          <span class="mono" style="font-size: 10px; color: var(--muted)">{{
            priorityScore(t)
          }}</span>
        </div>
      </div>
    </VFrame>
  </div>
</template>
