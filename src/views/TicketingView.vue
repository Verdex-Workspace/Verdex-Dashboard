<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VButton, VFrame, VSheetHeader, VTabs } from '@/components/ui'
import { fetchTicketing } from '@/services/ticketing.service'
import { fetchTools } from '@/services/projects.service'
import { useUiStore } from '@/stores/ui'
import { useDetailStore } from '@/stores/detail'
import { useAuthStore } from '@/stores/auth'
import KanbanBoard from './ticketing/KanbanBoard.vue'
import TicketTable from './ticketing/TicketTable.vue'
import RoadmapChart from './ticketing/RoadmapChart.vue'
import GanttChart from './ticketing/GanttChart.vue'
import PriorityMatrix from './ticketing/PriorityMatrix.vue'
import TicketDetailPanel from './ticketing/TicketDetailPanel.vue'
import AddTicketPanel from './ticketing/AddTicketPanel.vue'
import type { Assignee, GanttTask, RoadmapItem, Ticket } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)
const detail = useDetailStore()
const auth = useAuthStore()

const tickets = ref<Ticket[]>([])
const assignees = ref<Assignee[]>([])
const roadmap = ref<RoadmapItem[]>([])
const gantt = ref<GanttTask[]>([])
const months = ref<string[]>([])
const weeks = ref<string[]>([])
const repos = ref<{ id: string; name: string; repo: string }[]>([])
const loading = ref(true)

const view = ref('kanban')
const filterTool = ref('')
const filterType = ref('')
const filterPriority = ref('')
const filterAssignee = ref('')

const VIEWS = [
  { id: 'kanban', label: 'Kanban' },
  { id: 'table', label: 'Table' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'gantt', label: 'Gantt' },
  { id: 'matrix', label: 'Priorisation' },
]

let nextRef = 200

async function load() {
  loading.value = true
  const [data, tls] = await Promise.all([
    fetchTicketing(activeClient.value.id),
    fetchTools(activeClient.value.id),
  ])
  tickets.value = data.tickets
  assignees.value = data.assignees
  roadmap.value = data.roadmap
  gantt.value = data.gantt
  months.value = data.months
  weeks.value = data.weeks
  nextRef = data.tickets.length ? Math.max(...data.tickets.map((t) => t.ref)) + 1 : 200
  // Dépôts suivis (pour le pont GitHub depuis un ticket).
  repos.value = tls
    .filter((t) => t.repo)
    .map((t) => ({ id: t.id, name: t.name, repo: t.repo as string }))
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)

const tools = computed(
  () => [...new Set(tickets.value.map((t) => t.toolId).filter(Boolean))] as string[],
)

const filtered = computed(() =>
  tickets.value.filter(
    (t) =>
      (!filterTool.value || t.toolId === filterTool.value) &&
      (!filterType.value || t.type === filterType.value) &&
      (!filterPriority.value || t.priority === filterPriority.value) &&
      (!filterAssignee.value || t.assigneeId === filterAssignee.value),
  ),
)

const ticketViews = new Set(['kanban', 'table', 'matrix'])

function openTicket(ticket: Ticket) {
  detail.open({
    icon: '◧',
    title: `#${ticket.ref} ${ticket.title}`,
    sub: `${ticket.type} · ${ticket.priority} · ${ticket.toolId ?? '—'}`,
    component: markRaw(TicketDetailPanel),
    props: { ticket, assignees: assignees.value, repos: repos.value },
  })
}

/** Mode démo : ajout local (non persistant). */
function addTicketDemo() {
  const ticket: Ticket = {
    id: `t-${nextRef}`,
    ref: nextRef++,
    title: 'Nouveau ticket',
    description: 'À détailler.',
    type: 'feature',
    priority: 'P3',
    status: 'backlog',
    effort: 3,
    impact: 30,
    toolId: filterTool.value || null,
    clientId: activeClient.value.id,
    assigneeId: null,
    labels: [],
    deadline: null,
    sprint: null,
    linkedPrs: [],
    linkedIssues: [],
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  tickets.value = [ticket, ...tickets.value]
  openTicket(ticket)
}

/** Mode connecté : formulaire → persistance Supabase. */
function openAddTicket() {
  detail.open({
    icon: '＋',
    title: 'Nouveau ticket',
    sub: 'backlog',
    component: markRaw(AddTicketPanel),
    props: {
      onAdded: (ticket: Ticket) => {
        tickets.value = [ticket, ...tickets.value]
      },
    },
  })
}

function addTicket() {
  if (auth.demoMode) addTicketDemo()
  else openAddTicket()
}

const selectStyle =
  'border:1px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:11px;border-radius:8px;padding:5px 8px;cursor:pointer'
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Ticketing · style GitHub Projects"
      title="Tickets — Bugs & Améliorations"
      desc="Un seul backlog cross-outils, plusieurs vues sur les mêmes tickets : Kanban, Table, Roadmap, Gantt et matrice de priorisation. Point d'entrée unique pour piloter la qualité et la charge de travail."
    />

    <div
      style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 14px"
    >
      <VTabs v-model="view" :items="VIEWS" />
      <span style="flex: 1" />
      <template v-if="ticketViews.has(view)">
        <select v-model="filterTool" :style="selectStyle" aria-label="Filtrer par outil">
          <option value="">outil ▾</option>
          <option v-for="t in tools" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="filterType" :style="selectStyle" aria-label="Filtrer par type">
          <option value="">type ▾</option>
          <option value="bug">bug</option>
          <option value="feature">feature</option>
          <option value="perf">perf</option>
          <option value="chore">chore</option>
        </select>
        <select v-model="filterPriority" :style="selectStyle" aria-label="Filtrer par priorité">
          <option value="">priorité ▾</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        <select v-model="filterAssignee" :style="selectStyle" aria-label="Filtrer par assigné">
          <option value="">assigné ▾</option>
          <option v-for="a in assignees" :key="a.id" :value="a.id">{{ a.name }}</option>
        </select>
      </template>
      <VButton primary @click="addTicket">+ ticket</VButton>
    </div>

    <VFrame chrome :title="`verdex.app / ticketing / ${view}`">
      <p v-if="loading" class="mono" style="color: var(--muted)">Chargement…</p>

      <!-- État vide (vues basées sur les tickets) -->
      <div
        v-else-if="ticketViews.has(view) && !tickets.length"
        style="display: grid; place-items: center; text-align: center; padding: 36px 0"
      >
        <div>
          <div style="font-size: 28px; color: var(--accent)">◧</div>
          <p style="font-size: 13.5px; margin: 10px 0 4px">Aucun ticket pour le moment.</p>
          <p class="mono" style="font-size: 11px; color: var(--muted); margin-bottom: 14px">
            Créez votre premier ticket pour alimenter le backlog.
          </p>
          <VButton primary @click="addTicket">+ ticket</VButton>
        </div>
      </div>

      <template v-else>
        <KanbanBoard
          v-if="view === 'kanban'"
          :tickets="filtered"
          :assignees="assignees"
          @open="openTicket"
        />
        <TicketTable
          v-else-if="view === 'table'"
          :tickets="filtered"
          :assignees="assignees"
          @open="openTicket"
        />
        <RoadmapChart v-else-if="view === 'roadmap'" :items="roadmap" :months="months" />
        <GanttChart v-else-if="view === 'gantt'" :tasks="gantt" :weeks="weeks" />
        <PriorityMatrix v-else-if="view === 'matrix'" :tickets="filtered" @open="openTicket" />
      </template>
    </VFrame>

    <p class="mono" style="color: var(--muted); font-size: 10.5px; margin-top: 12px">
      Même jeu de tickets, plusieurs lectures · champs custom (effort, sprint, outil, deadline)
      façon GitHub Projects.
    </p>
  </div>
</template>
