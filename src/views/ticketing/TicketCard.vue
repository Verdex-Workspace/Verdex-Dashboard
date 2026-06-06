<script setup lang="ts">
import { computed } from 'vue'
import { VChip } from '@/components/ui'
import type { Assignee, Ticket } from '@/types'
import { PRIORITY_KIND, TYPE_KIND, TYPE_LABEL, formatDeadline } from './helpers'

const props = defineProps<{ ticket: Ticket; assignees: Assignee[] }>()
defineEmits<{ open: [ticket: Ticket] }>()

const assignee = computed(
  () => props.assignees.find((a) => a.id === props.ticket.assigneeId) ?? null,
)
const deadline = computed(() => formatDeadline(props.ticket.deadline))
</script>

<template>
  <div
    class="wbox plain clickable"
    style="padding: 10px; display: flex; flex-direction: column; gap: 7px"
    @click="$emit('open', ticket)"
  >
    <div style="display: flex; align-items: center; gap: 6px">
      <VChip :kind="TYPE_KIND[ticket.type]">{{ TYPE_LABEL[ticket.type] }}</VChip>
      <span style="margin-left: auto"
        ><VChip :kind="PRIORITY_KIND[ticket.priority]">{{ ticket.priority }}</VChip></span
      >
    </div>
    <span style="font-size: 12.5px; line-height: 1.3">{{ ticket.title }}</span>
    <div style="display: flex; align-items: center; gap: 6px; margin-top: auto">
      <span class="mono" style="font-size: 9.5px; color: var(--muted)">#{{ ticket.ref }}</span>
      <VChip v-if="deadline" :kind="deadline.kind" :dot="false">◷ {{ deadline.label }}</VChip>
      <span class="mono" style="font-size: 9.5px; color: var(--muted)"
        >{{ ticket.effort }} pts</span
      >
      <span
        v-if="assignee"
        :title="assignee.name"
        class="mono"
        style="
          margin-left: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--fill-2);
          border: 1px solid var(--line);
          display: grid;
          place-items: center;
          font-size: 8.5px;
        "
        >{{ assignee.initials }}</span
      >
      <span
        v-else
        style="
          margin-left: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px dashed var(--line);
        "
      />
    </div>
  </div>
</template>
