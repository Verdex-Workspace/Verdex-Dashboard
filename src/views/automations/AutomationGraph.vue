<script setup lang="ts">
import type { FlowEdge, FlowNode } from '@/types'

const props = defineProps<{
  nodes: FlowNode[]
  edges: FlowEdge[]
  /** index du nœud en cours d'exécution (-1 = inactif) */
  runIndex: number
}>()

const active = (id: number) => props.runIndex >= 0 && id <= props.runIndex
const nodeById = (id: number) => props.nodes.find((n) => n.id === id)!
</script>

<template>
  <div
    class="gridbg"
    style="
      position: relative;
      height: 260px;
      border: 1.5px solid var(--line);
      border-radius: 10px;
      background: var(--paper2);
      overflow: hidden;
    "
  >
    <svg style="position: absolute; inset: 0; width: 100%; height: 100%">
      <line
        v-for="(e, i) in edges"
        :key="i"
        :x1="`${nodeById(e.from).x}%`"
        :y1="`${nodeById(e.from).y}%`"
        :x2="`${nodeById(e.to).x}%`"
        :y2="`${nodeById(e.to).y}%`"
        :stroke="active(e.from) && active(e.to) ? 'var(--accent)' : 'var(--line)'"
        :stroke-width="active(e.from) && active(e.to) ? 2.4 : 1.6"
        :stroke-dasharray="active(e.from) && active(e.to) ? '0' : '5 5'"
        style="transition: stroke 0.3s"
      />
    </svg>
    <div
      v-for="n in nodes"
      :key="n.id"
      :style="{
        position: 'absolute',
        left: n.x + '%',
        top: n.y + '%',
        transform: 'translate(-50%, -50%)',
        width: '94px',
        padding: '8px 9px',
        borderRadius: '9px',
        background: active(n.id)
          ? 'color-mix(in oklab, var(--accent) 22%, var(--paper))'
          : 'var(--paper)',
        border: '1.6px solid ' + (active(n.id) ? 'var(--accent)' : 'var(--line)'),
        boxShadow:
          runIndex === n.id
            ? '0 0 0 4px color-mix(in oklab, var(--accent) 22%, transparent)'
            : 'none',
        transition: 'all 0.3s',
      }"
    >
      <div
        class="mono"
        :style="{ fontSize: '9.5px', color: active(n.id) ? 'var(--accent)' : 'var(--muted)' }"
      >
        {{ n.type }}
      </div>
      <div style="font-size: 10.5px; margin-top: 2px">{{ n.label }}</div>
    </div>
  </div>
</template>
