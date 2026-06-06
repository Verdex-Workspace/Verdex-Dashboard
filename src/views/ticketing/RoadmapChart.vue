<script setup lang="ts">
import { kindColor } from './helpers'
import type { RoadmapItem } from '@/types'

const props = defineProps<{ items: RoadmapItem[]; months: string[] }>()

function barStyle(item: RoadmapItem) {
  const total = props.months.length
  return {
    position: 'absolute' as const,
    left: `${(item.startMonth / total) * 100}%`,
    width: `${(item.span / total) * 100}%`,
    height: '26px',
    borderRadius: '8px',
    background: `color-mix(in oklab, ${kindColor(item.kind)} 28%, var(--fill))`,
    border: `1.5px solid color-mix(in oklab, ${kindColor(item.kind)} 60%, var(--line))`,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    fontSize: '11px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <div style="display: flex; padding-left: 150px">
      <span
        v-for="m in months"
        :key="m"
        class="mono"
        style="flex: 1; font-size: 10px; color: var(--muted); text-align: center"
        >{{ m }}</span
      >
    </div>
    <div
      v-for="item in items"
      :key="item.id"
      style="display: flex; align-items: center; height: 38px"
    >
      <span style="width: 150px; font-size: 12.5px">{{ item.label }}</span>
      <div style="flex: 1; position: relative; height: 26px">
        <div :style="barStyle(item)">{{ item.span }} mois</div>
      </div>
    </div>
  </div>
</template>
