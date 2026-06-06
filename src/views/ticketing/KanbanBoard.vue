<script setup lang="ts">
import { computed } from 'vue'
import { VChip } from '@/components/ui'
import TicketCard from './TicketCard.vue'
import { STATUS_COLUMNS } from './helpers'
import type { Assignee, Ticket } from '@/types'

const props = defineProps<{ tickets: Ticket[]; assignees: Assignee[] }>()
defineEmits<{ open: [ticket: Ticket] }>()

const byColumn = computed(() =>
  STATUS_COLUMNS.map((col) => ({
    ...col,
    items: props.tickets.filter((t) => t.status === col.id),
  })),
)
</script>

<template>
  <div
    style="display: flex; gap: 12px; align-items: flex-start; overflow-x: auto; padding-bottom: 4px"
  >
    <div
      v-for="col in byColumn"
      :key="col.id"
      style="min-width: 178px; flex: 1; display: flex; flex-direction: column; gap: 9px"
    >
      <div style="display: flex; align-items: center; gap: 7px">
        <b style="font-size: 12.5px">{{ col.label }}</b>
        <VChip :dot="false">{{ col.items.length }}</VChip>
      </div>
      <TicketCard
        v-for="t in col.items"
        :key="t.id"
        :ticket="t"
        :assignees="assignees"
        @open="$emit('open', $event)"
      />
      <div
        v-if="!col.items.length"
        class="wbox dash"
        style="display: grid; place-items: center; min-height: 34px"
      >
        <span class="mono" style="font-size: 10px; color: var(--muted)">vide</span>
      </div>
    </div>
  </div>
</template>
