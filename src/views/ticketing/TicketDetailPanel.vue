<script setup lang="ts">
import { computed, ref } from 'vue'
import { VButton, VChip, VFrame } from '@/components/ui'
import { PRIORITY_KIND, STATUS_LABEL, TYPE_KIND, TYPE_LABEL, formatDeadline } from './helpers'
import { priorityScore, updateTicket } from '@/services/ticketing.service'
import { githubWrite } from '@/services/github.service'
import { useAuthStore } from '@/stores/auth'
import type { Assignee, LinkedRef, Ticket } from '@/types'

interface RepoOption {
  id: string
  name: string
  repo: string
}

const props = defineProps<{
  ticket: Ticket
  assignees: Assignee[]
  repos?: RepoOption[]
  onDelete?: (ticket: Ticket) => void
}>()

const auth = useAuthStore()
const assignee = computed(
  () => props.assignees.find((a) => a.id === props.ticket.assigneeId) ?? null,
)
const deadline = computed(() => formatDeadline(props.ticket.deadline))

// --- Pont GitHub : créer une issue depuis le ticket ---
const repoOptions = computed(() => props.repos ?? [])
const selectedRepo = ref(repoOptions.value[0]?.repo ?? '')
const linkedIssues = ref<LinkedRef[]>([...props.ticket.linkedIssues])
const pushing = ref(false)
const pushMsg = ref<{ ok: boolean; text: string; url: string | null } | null>(null)
const canBridge = computed(() => !auth.demoMode && repoOptions.value.length > 0)

async function pushIssue() {
  if (!selectedRepo.value) return
  pushing.value = true
  pushMsg.value = null
  try {
    const r = await githubWrite(selectedRepo.value, 'issue', {
      title: props.ticket.title,
      body: `${props.ticket.description}\n\n— créé depuis Verdex Dashboard (ticket #${props.ticket.ref})`,
      labels: props.ticket.labels.map((l) => l.name),
    })
    const repoName = selectedRepo.value.split('/')[1]
    const link: LinkedRef = {
      id: String(r.number ?? Date.now()),
      label: `${repoName}#${r.number ?? '?'}`,
    }
    linkedIssues.value = [...linkedIssues.value, link]
    await updateTicket(props.ticket.id, { linkedIssues: linkedIssues.value })
    pushMsg.value = { ok: true, text: `Issue créée · ${link.label}`, url: r.url }
  } catch (e) {
    pushMsg.value = { ok: false, text: e instanceof Error ? e.message : 'Échec.', url: null }
  } finally {
    pushing.value = false
  }
}

const selectStyle =
  'border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:11.5px;border-radius:8px;padding:7px 10px;cursor:pointer;flex:1'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- statut -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
      <VChip :kind="TYPE_KIND[ticket.type]">{{ TYPE_LABEL[ticket.type] }}</VChip>
      <VChip :kind="PRIORITY_KIND[ticket.priority]">{{ ticket.priority }}</VChip>
      <VChip :dot="false">{{ STATUS_LABEL[ticket.status] }}</VChip>
      <VChip v-if="ticket.sprint" :dot="false">{{ ticket.sprint }}</VChip>
      <button
        v-if="onDelete && !auth.demoMode"
        type="button"
        class="mono"
        style="
          margin-left: auto;
          font-size: 10.5px;
          border: 1px solid var(--line);
          background: var(--paper2);
          color: var(--err);
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          white-space: nowrap;
        "
        title="Supprimer ce ticket"
        @click="onDelete(ticket)"
      >
        🗑 supprimer
      </button>
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
        <div v-if="linkedIssues.length" style="display: flex; flex-direction: column; gap: 6px">
          <span
            v-for="i in linkedIssues"
            :key="i.id"
            class="mono"
            style="font-size: 11.5px; color: var(--accent)"
            >● {{ i.label }}</span
          >
        </div>
        <span v-else class="mono" style="font-size: 11px; color: var(--muted)">aucune</span>
      </VFrame>
    </div>

    <!-- Pont GitHub : créer une issue depuis ce ticket -->
    <VFrame cap="Pousser sur GitHub" tag="issue">
      <template v-if="canBridge">
        <div style="display: flex; gap: 8px; align-items: center">
          <select v-model="selectedRepo" :style="selectStyle" aria-label="Dépôt cible">
            <option v-for="r in repoOptions" :key="r.id" :value="r.repo">{{ r.repo }}</option>
          </select>
          <VButton primary @click="pushIssue">{{
            pushing ? 'Création…' : "Créer l'issue"
          }}</VButton>
        </div>
        <p
          v-if="pushMsg"
          class="mono"
          :style="{
            fontSize: '11px',
            marginTop: '10px',
            color: pushMsg.ok ? 'var(--accent)' : 'var(--err)',
          }"
        >
          {{ pushMsg.ok ? '✓ ' : '⚠ ' }}{{ pushMsg.text }}
          <a
            v-if="pushMsg.url"
            :href="pushMsg.url"
            target="_blank"
            rel="noopener"
            style="color: var(--accent)"
            >ouvrir ↗</a
          >
        </p>
        <p
          class="mono"
          style="font-size: 10px; color: var(--muted); margin-top: 8px; line-height: 1.5"
        >
          Crée une issue réelle (titre, description, labels du ticket) sur le dépôt choisi et la
          relie automatiquement à ce ticket.
        </p>
      </template>
      <p v-else class="mono" style="font-size: 11px; color: var(--muted)">
        {{
          auth.demoMode
            ? 'Indisponible en mode démo.'
            : 'Suivez d’abord un dépôt dans « Projets & Outils » pour pouvoir y créer des issues.'
        }}
      </p>
    </VFrame>

    <!-- Actions futures (Proton) -->
    <VFrame cap="Actions" tag="point d'entrée unique">
      <p class="mono" style="font-size: 10px; color: var(--muted); line-height: 1.5">
        Bientôt : répercuter la deadline dans Proton Calendar, classer le rapport généré dans Proton
        Drive et notifier par Proton Mail — en une action. Nécessite le connecteur Proton (backend).
      </p>
    </VFrame>
  </div>
</template>
