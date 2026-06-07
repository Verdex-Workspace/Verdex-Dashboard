<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VFrame } from '@/components/ui'
import { createTicket } from '@/services/ticketing.service'
import { SIZES } from './helpers'
import { useDetailStore } from '@/stores/detail'
import type {
  Assignee,
  Ticket,
  TicketPriority,
  TicketSize,
  TicketStatus,
  TicketType,
} from '@/types'

const props = defineProps<{
  onAdded?: (ticket: Ticket) => void
  assignees?: Assignee[]
  tools?: { id: string; name: string }[]
  clientId?: string
}>()
const detail = useDetailStore()

const title = ref('')
const description = ref('')
const type = ref<TicketType>('feature')
const priority = ref<TicketPriority>('P2')
const status = ref<TicketStatus>('backlog')
const effort = ref(3)
const impact = ref(30)
const estimate = ref<number | null>(null)
const size = ref<TicketSize | null>(null)
const assigneeId = ref<string | null>(null)
const toolId = ref<string | null>(null)
const milestone = ref('')
const sprint = ref('')
const deadline = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!title.value.trim()) {
    error.value = 'Le titre est requis.'
    return
  }
  loading.value = true
  try {
    const ticket = await createTicket({
      title: title.value.trim(),
      description: description.value,
      type: type.value,
      priority: priority.value,
      status: status.value,
      effort: effort.value,
      impact: impact.value,
      estimate: estimate.value,
      size: size.value,
      assigneeId: assigneeId.value,
      toolId: toolId.value,
      clientId: props.clientId,
      milestone: milestone.value.trim() || null,
      sprint: sprint.value.trim() || null,
      deadline: deadline.value || null,
    })
    props.onAdded?.(ticket)
    detail.close()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Échec de la création.'
  } finally {
    loading.value = false
  }
}

const input =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:12.5px;border-radius:9px;padding:9px 11px;outline:none'
const lbl = 'font-size:9.5px;color:var(--muted);font-family:var(--font-mono)'
const col = 'flex:1;display:flex;flex-direction:column;gap:5px'
</script>

<template>
  <VFrame cap="Nouveau ticket" tag="backlog">
    <form style="display: flex; flex-direction: column; gap: 11px" @submit.prevent="submit">
      <label style="display: flex; flex-direction: column; gap: 5px">
        <span :style="lbl">TITRE *</span>
        <input v-model="title" type="text" :style="input" />
      </label>

      <div style="display: flex; gap: 10px">
        <label :style="col">
          <span :style="lbl">TYPE</span>
          <select v-model="type" :style="input">
            <option value="bug">bug</option>
            <option value="feature">feature</option>
            <option value="perf">perf</option>
            <option value="chore">chore</option>
          </select>
        </label>
        <label :style="col">
          <span :style="lbl">PRIORITÉ</span>
          <select v-model="priority" :style="input">
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </label>
        <label :style="col">
          <span :style="lbl">STATUT</span>
          <select v-model="status" :style="input">
            <option value="backlog">Backlog</option>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="review">Review</option>
            <option value="done">Fait</option>
          </select>
        </label>
      </div>

      <div style="display: flex; gap: 10px">
        <label :style="col">
          <span :style="lbl">ASSIGNÉ</span>
          <select v-model="assigneeId" :style="input">
            <option :value="null">non assigné</option>
            <option v-for="a in assignees ?? []" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </label>
        <label :style="col">
          <span :style="lbl">OUTIL</span>
          <select v-model="toolId" :style="input">
            <option :value="null">—</option>
            <option v-for="t in tools ?? []" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </label>
      </div>

      <div style="display: flex; gap: 10px">
        <label :style="col">
          <span :style="lbl">MILESTONE</span>
          <input v-model="milestone" type="text" :style="input" />
        </label>
        <label :style="col">
          <span :style="lbl">SPRINT</span>
          <input v-model="sprint" type="text" :style="input" />
        </label>
        <label style="width: 110px; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">SIZE</span>
          <select v-model="size" :style="input">
            <option :value="null">—</option>
            <option v-for="s in SIZES" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
      </div>

      <div style="display: flex; gap: 10px">
        <label style="width: 90px; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">EFFORT</span>
          <input v-model.number="effort" type="number" min="0" :style="input" />
        </label>
        <label style="width: 90px; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">ESTIMATE</span>
          <input v-model.number="estimate" type="number" min="0" :style="input" />
        </label>
        <label style="width: 90px; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">IMPACT</span>
          <input v-model.number="impact" type="number" min="0" max="100" :style="input" />
        </label>
        <label :style="col">
          <span :style="lbl">ÉCHÉANCE</span>
          <input v-model="deadline" type="date" :style="input" />
        </label>
      </div>

      <label style="display: flex; flex-direction: column; gap: 5px">
        <span :style="lbl">DESCRIPTION</span>
        <textarea v-model="description" rows="3" :style="input" />
      </label>

      <p v-if="error" class="mono" style="font-size: 11px; color: var(--err); margin: 0">
        {{ error }}
      </p>
      <div>
        <VButton primary @click="submit">{{ loading ? 'Création…' : 'Créer le ticket' }}</VButton>
      </div>
    </form>
  </VFrame>
</template>
