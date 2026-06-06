<script setup lang="ts">
import type { GanttTask } from '@/types'

const props = defineProps<{ tasks: GanttTask[]; weeks: string[] }>()

function barStyle(task: GanttTask) {
  const total = props.weeks.length
  const accent = task.critical ? 'var(--err)' : 'var(--accent)'
  return {
    position: 'absolute' as const,
    left: `${(task.startWeek / total) * 100}%`,
    width: `${(task.span / total) * 100}%`,
    height: '20px',
    borderRadius: '6px',
    background: `color-mix(in oklab, ${accent} 32%, var(--fill))`,
    border: `1.5px solid color-mix(in oklab, ${accent} 60%, var(--line))`,
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 9px">
    <div style="display: flex; padding-left: 150px">
      <span
        v-for="w in weeks"
        :key="w"
        class="mono"
        style="flex: 1; font-size: 9.5px; color: var(--muted); text-align: center"
        >{{ w }}</span
      >
    </div>
    <div
      v-for="task in tasks"
      :key="task.id"
      style="display: flex; align-items: center; height: 34px"
    >
      <span style="width: 150px; font-size: 12px">
        {{ task.label }}
        <span v-if="task.critical" class="mono" style="font-size: 9px; color: var(--err)">●</span>
      </span>
      <div style="flex: 1; position: relative; height: 20px">
        <div
          style="
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
              90deg,
              transparent,
              transparent calc(100% / 6 - 1px),
              var(--line-2) calc(100% / 6 - 1px),
              var(--line-2) calc(100% / 6)
            );
          "
        />
        <div :style="barStyle(task)" />
      </div>
    </div>
    <div class="legend" style="padding-left: 150px">
      <span style="color: var(--err)">● chemin critique</span>
    </div>
  </div>
</template>
