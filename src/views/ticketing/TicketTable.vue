<script setup lang="ts">
import { VChip } from '@/components/ui'
import { PRIORITY_KIND, STATUS_LABEL, TYPE_KIND, TYPE_LABEL, formatDeadline } from './helpers'
import type { Assignee, Ticket } from '@/types'

const props = defineProps<{ tickets: Ticket[]; assignees: Assignee[] }>()
defineEmits<{ open: [ticket: Ticket] }>()

function assigneeOf(id: string | null) {
  return props.assignees.find((a) => a.id === id) ?? null
}
</script>

<template>
  <div style="overflow-x: auto">
    <div class="legend" style="padding: 0 12px 8px; min-width: 720px">
      <span style="flex: 1">TICKET</span>
      <span style="width: 70px">TYPE</span>
      <span style="width: 44px">PRIO</span>
      <span style="width: 120px">OUTIL</span>
      <span style="width: 70px">ASSIGNÉ</span>
      <span style="width: 50px">EFFORT</span>
      <span style="width: 80px">ÉCHÉANCE</span>
      <span style="width: 80px">STATUT</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 6px; min-width: 720px">
      <div
        v-for="t in tickets"
        :key="t.id"
        class="wbox plain clickable"
        style="display: flex; align-items: center; gap: 10px; padding: 9px 12px"
        @click="$emit('open', t)"
      >
        <span style="flex: 1; font-size: 12.5px; min-width: 0">
          <span class="mono" style="font-size: 10px; color: var(--muted)">#{{ t.ref }}</span>
          {{ t.title }}
        </span>
        <span style="width: 70px"
          ><VChip :kind="TYPE_KIND[t.type]">{{ TYPE_LABEL[t.type] }}</VChip></span
        >
        <span style="width: 44px"
          ><VChip :kind="PRIORITY_KIND[t.priority]">{{ t.priority }}</VChip></span
        >
        <span class="mono" style="width: 120px; font-size: 11px; color: var(--muted)">{{
          t.toolId ?? '—'
        }}</span>
        <span class="mono" style="width: 70px; font-size: 11px">{{
          assigneeOf(t.assigneeId)?.initials ?? '—'
        }}</span>
        <span class="mono" style="width: 50px; font-size: 11px">{{ t.effort }} pts</span>
        <span style="width: 80px">
          <VChip
            v-if="formatDeadline(t.deadline)"
            :kind="formatDeadline(t.deadline)!.kind"
            :dot="false"
            >◷ {{ formatDeadline(t.deadline)!.label }}</VChip
          >
          <span v-else class="mono" style="font-size: 11px; color: var(--muted)">—</span>
        </span>
        <span class="mono" style="width: 80px; font-size: 10.5px; color: var(--muted)">{{
          STATUS_LABEL[t.status]
        }}</span>
      </div>
    </div>
  </div>
</template>
