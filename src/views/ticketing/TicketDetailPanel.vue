<script setup lang="ts">
import { computed } from 'vue'
import { VChip, VFrame } from '@/components/ui'
import { PRIORITY_KIND, STATUS_LABEL, TYPE_KIND, TYPE_LABEL, formatDeadline } from './helpers'
import { priorityScore } from '@/services/ticketing.service'
import type { Assignee, Ticket } from '@/types'

const props = defineProps<{ ticket: Ticket; assignees: Assignee[] }>()

const assignee = computed(
  () => props.assignees.find((a) => a.id === props.ticket.assigneeId) ?? null,
)
const deadline = computed(() => formatDeadline(props.ticket.deadline))

/** Actions futures (vision « point d'entrée unique »). Nécessitent le connecteur Proton. */
const futureActions = [
  { icon: '◷', label: 'Planifier dans Proton Calendar' },
  { icon: '↓', label: 'Générer le rapport (PDF)' },
  { icon: '☁', label: 'Classer dans Proton Drive' },
  { icon: '✉', label: 'Notifier par Proton Mail' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- statut -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap">
      <VChip :kind="TYPE_KIND[ticket.type]">{{ TYPE_LABEL[ticket.type] }}</VChip>
      <VChip :kind="PRIORITY_KIND[ticket.priority]">{{ ticket.priority }}</VChip>
      <VChip :dot="false">{{ STATUS_LABEL[ticket.status] }}</VChip>
      <VChip v-if="ticket.sprint" :dot="false">{{ ticket.sprint }}</VChip>
    </div>

    <p style="font-size: 13px; line-height: 1.5; margin: 0">{{ ticket.description }}</p>

    <!-- méta / relations -->
    <VFrame cap="Détails" tag="relations">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px">
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">OUTIL / REPO</span>
          <div style="font-size: 12.5px">{{ ticket.toolId ?? '—' }}</div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">CLIENT</span>
          <div style="font-size: 12.5px">{{ ticket.clientId }}</div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">ASSIGNÉ</span>
          <div style="font-size: 12.5px">{{ assignee?.name ?? 'non assigné' }}</div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">EFFORT / SCORE</span>
          <div style="font-size: 12.5px">
            {{ ticket.effort }} pts · score {{ priorityScore(ticket) }}
          </div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">ÉCHÉANCE</span>
          <div style="font-size: 12.5px">
            <VChip v-if="deadline" :kind="deadline.kind" :dot="false">◷ {{ deadline.label }}</VChip>
            <span v-else>—</span>
          </div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">IMPACT</span>
          <div style="font-size: 12.5px">{{ ticket.impact }} / 100</div>
        </div>
      </div>

      <div
        v-if="ticket.labels.length"
        style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px"
      >
        <VChip v-for="l in ticket.labels" :key="l.id" :kind="l.kind">{{ l.name }}</VChip>
      </div>
    </VFrame>

    <!-- PR / issues liées -->
    <div class="grid2">
      <VFrame cap="Pull requests" tag="liées">
        <div v-if="ticket.linkedPrs.length" style="display: flex; flex-direction: column; gap: 6px">
          <span
            v-for="p in ticket.linkedPrs"
            :key="p.id"
            class="mono"
            style="font-size: 11.5px; color: var(--accent)"
            >⑂ {{ p.label }}</span
          >
        </div>
        <span v-else class="mono" style="font-size: 11px; color: var(--muted)">aucune</span>
      </VFrame>
      <VFrame cap="Issues" tag="liées">
        <div
          v-if="ticket.linkedIssues.length"
          style="display: flex; flex-direction: column; gap: 6px"
        >
          <span
            v-for="i in ticket.linkedIssues"
            :key="i.id"
            class="mono"
            style="font-size: 11.5px; color: var(--accent)"
            >● {{ i.label }}</span
          >
        </div>
        <span v-else class="mono" style="font-size: 11px; color: var(--muted)">aucune</span>
      </VFrame>
    </div>

    <!-- Actions futures (point d'entrée unique) -->
    <VFrame cap="Actions" tag="point d'entrée unique">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <button
          v-for="a in futureActions"
          :key="a.label"
          class="btnw"
          type="button"
          disabled
          style="justify-content: flex-start; opacity: 0.75; cursor: not-allowed"
        >
          <span>{{ a.icon }}</span>
          {{ a.label }}
          <span style="margin-left: auto"><VChip :dot="false">à venir</VChip></span>
        </button>
      </div>
      <p
        class="mono"
        style="font-size: 10px; color: var(--muted); margin-top: 10px; line-height: 1.5"
      >
        Depuis ce ticket, une seule action répercutera la deadline dans Proton Calendar, classera le
        rapport généré dans Proton Drive et enverra l'alerte par Proton Mail. Nécessite le
        connecteur Proton (backend) — voir la checklist infrastructure.
      </p>
    </VFrame>
  </div>
</template>
