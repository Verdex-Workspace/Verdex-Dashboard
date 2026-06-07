<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VFrame } from '@/components/ui'
import { createTicket } from '@/services/ticketing.service'
import { useDetailStore } from '@/stores/detail'
import type { Ticket, TicketPriority, TicketType } from '@/types'

const props = defineProps<{ onAdded?: (ticket: Ticket) => void }>()
const detail = useDetailStore()

const title = ref('')
const description = ref('')
const type = ref<TicketType>('feature')
const priority = ref<TicketPriority>('P2')
const effort = ref(3)
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
      effort: effort.value,
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
</script>

<template>
  <VFrame cap="Nouveau ticket" tag="backlog">
    <form style="display: flex; flex-direction: column; gap: 11px" @submit.prevent="submit">
      <label style="display: flex; flex-direction: column; gap: 5px">
        <span :style="lbl">TITRE *</span>
        <input v-model="title" type="text" :style="input" />
      </label>

      <div style="display: flex; gap: 10px">
        <label style="flex: 1; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">TYPE</span>
          <select v-model="type" :style="input">
            <option value="bug">bug</option>
            <option value="feature">feature</option>
            <option value="perf">perf</option>
            <option value="chore">chore</option>
          </select>
        </label>
        <label style="flex: 1; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">PRIORITÉ</span>
          <select v-model="priority" :style="input">
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </label>
        <label style="width: 90px; display: flex; flex-direction: column; gap: 5px">
          <span :style="lbl">EFFORT</span>
          <input v-model.number="effort" type="number" min="0" :style="input" />
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
