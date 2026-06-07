<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { VButton, VChip, VFrame } from '@/components/ui'
import {
  LABEL_CATALOG,
  PRIORITY_KIND,
  SIZES,
  STATUS_COLUMNS,
  TYPE_KIND,
  TYPE_LABEL,
  formatDeadline,
} from './helpers'
import { priorityScore, updateTicket, type TicketPatch } from '@/services/ticketing.service'
import { githubWrite, updateGithubIssue } from '@/services/github.service'
import { useAuthStore } from '@/stores/auth'
import type { Assignee, Label, LinkedRef, Ticket } from '@/types'

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
  onUpdate?: (ticket: Ticket) => void
}>()

const auth = useAuthStore()

// --- Édition inline : modèle local initialisé depuis le ticket ---
const form = reactive({
  status: props.ticket.status,
  priority: props.ticket.priority,
  type: props.ticket.type,
  assigneeId: props.ticket.assigneeId,
  milestone: props.ticket.milestone ?? '',
  size: props.ticket.size,
  estimate: props.ticket.estimate,
  deadline: props.ticket.deadline ?? '',
  sprint: props.ticket.sprint ?? '',
  labels: [...props.ticket.labels] as Label[],
})
const saveMsg = ref<{ ok: boolean; text: string } | null>(null)
const syncMsg = ref<{ ok: boolean; text: string } | null>(null)
const deadline = computed(() => formatDeadline(form.deadline || null))

/** Issues liées (état local — alimenté à la création d'issue). */
const linkedIssues = ref<LinkedRef[]>([...props.ticket.linkedIssues])

/** Champs du ticket qui ont un équivalent natif sur une issue GitHub. */
const SYNC_FIELDS: (keyof TicketPatch)[] = ['status', 'labels', 'milestone', 'assigneeId']

/** Issue liée synchronisable (créée depuis le dashboard → possède repo + number). */
const syncTarget = computed<LinkedRef | undefined>(() =>
  linkedIssues.value.find((i) => i.repo && typeof i.number === 'number'),
)

/** Ticket reconstruit à partir du modèle local (champs normalisés). */
function merged(): Ticket {
  return {
    ...props.ticket,
    status: form.status,
    priority: form.priority,
    type: form.type,
    assigneeId: form.assigneeId,
    milestone: form.milestone.trim() || null,
    size: form.size,
    estimate: form.estimate ?? null,
    deadline: form.deadline || null,
    sprint: form.sprint.trim() || null,
    labels: form.labels,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

/** Persiste un champ (hors démo) et reflète le changement dans la liste. */
async function save(patch: TicketPatch) {
  saveMsg.value = null
  try {
    if (!auth.demoMode) await updateTicket(props.ticket.id, patch)
    props.onUpdate?.(merged())
    saveMsg.value = { ok: true, text: 'Enregistré' }
  } catch (e) {
    saveMsg.value = { ok: false, text: e instanceof Error ? e.message : 'Échec.' }
  }
  // Synchro best-effort vers l'issue GitHub liée (n'annule pas l'édition locale).
  if (Object.keys(patch).some((k) => SYNC_FIELDS.includes(k as keyof TicketPatch))) {
    void syncIssue()
  }
}

/** Pousse l'état courant du ticket vers l'issue GitHub liée (hors démo). */
async function syncIssue() {
  const target = syncTarget.value
  if (auth.demoMode || !target?.repo || target.number === undefined) return
  syncMsg.value = null
  try {
    const login = props.assignees.find((a) => a.id === form.assigneeId)?.githubLogin
    await updateGithubIssue(target.repo, target.number, {
      state: form.status === 'done' ? 'closed' : 'open',
      labels: form.labels.map((l) => l.name),
      milestoneTitle: form.milestone.trim() || null,
      assignees: login ? [login] : [],
    })
    syncMsg.value = { ok: true, text: `Issue synchronisée · ${target.label}` }
  } catch (e) {
    syncMsg.value = { ok: false, text: e instanceof Error ? e.message : 'Synchro échouée.' }
  }
}

function toggleLabel(label: Label) {
  const has = form.labels.some((l) => l.id === label.id)
  form.labels = has ? form.labels.filter((l) => l.id !== label.id) : [...form.labels, label]
  save({ labels: form.labels })
}
function isActive(label: Label) {
  return form.labels.some((l) => l.id === label.id)
}

// --- Pont GitHub : créer une issue depuis le ticket ---
const repoOptions = computed(() => props.repos ?? [])
const selectedRepo = ref(repoOptions.value[0]?.repo ?? '')
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
      labels: form.labels.map((l) => l.name),
    })
    const repoName = selectedRepo.value.split('/')[1]
    const link: LinkedRef = {
      id: String(r.number ?? Date.now()),
      label: `${repoName}#${r.number ?? '?'}`,
      repo: selectedRepo.value,
      number: r.number ?? undefined,
    }
    linkedIssues.value = [...linkedIssues.value, link]
    // Mémoriser le lien (avec repo/number) sur le ticket pour les futures synchros.
    props.onUpdate?.({ ...merged(), linkedIssues: linkedIssues.value })
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
const fieldStyle =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:12px;border-radius:8px;padding:6px 9px;outline:none'
const capStyle = 'font-size:9.5px;color:var(--muted)'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- statut -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
      <VChip :kind="TYPE_KIND[form.type]">{{ TYPE_LABEL[form.type] }}</VChip>
      <VChip :kind="PRIORITY_KIND[form.priority]">{{ form.priority }}</VChip>
      <VChip v-if="form.sprint" :dot="false">{{ form.sprint }}</VChip>
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

    <!-- méta / relations — édition inline -->
    <VFrame cap="Détails" tag="édition inline">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px">
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">STATUT</span>
          <select v-model="form.status" :style="fieldStyle" @change="save({ status: form.status })">
            <option v-for="c in STATUS_COLUMNS" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">PRIORITÉ</span>
          <select
            v-model="form.priority"
            :style="fieldStyle"
            @change="save({ priority: form.priority })"
          >
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">TYPE</span>
          <select v-model="form.type" :style="fieldStyle" @change="save({ type: form.type })">
            <option value="bug">bug</option>
            <option value="feature">feature</option>
            <option value="perf">perf</option>
            <option value="chore">chore</option>
          </select>
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">ASSIGNÉ</span>
          <select
            v-model="form.assigneeId"
            :style="fieldStyle"
            @change="save({ assigneeId: form.assigneeId })"
          >
            <option :value="null">non assigné</option>
            <option v-for="a in assignees" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">MILESTONE</span>
          <input
            v-model="form.milestone"
            type="text"
            :style="fieldStyle"
            placeholder="—"
            @change="save({ milestone: form.milestone.trim() || null })"
          />
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">SIZE</span>
          <select v-model="form.size" :style="fieldStyle" @change="save({ size: form.size })">
            <option :value="null">—</option>
            <option v-for="s in SIZES" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">ESTIMATE</span>
          <input
            v-model.number="form.estimate"
            type="number"
            min="0"
            :style="fieldStyle"
            placeholder="—"
            @change="save({ estimate: form.estimate ?? null })"
          />
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">SPRINT</span>
          <input
            v-model="form.sprint"
            type="text"
            :style="fieldStyle"
            placeholder="—"
            @change="save({ sprint: form.sprint.trim() || null })"
          />
        </label>
        <label style="display: flex; flex-direction: column; gap: 4px">
          <span class="mono" :style="capStyle">ÉCHÉANCE</span>
          <input
            v-model="form.deadline"
            type="date"
            :style="fieldStyle"
            @change="save({ deadline: form.deadline || null })"
          />
          <VChip v-if="deadline" :kind="deadline.kind" :dot="false">◷ {{ deadline.label }}</VChip>
        </label>
        <div>
          <span class="mono" :style="capStyle">OUTIL · CLIENT</span>
          <div style="font-size: 12.5px">{{ ticket.toolId ?? '—' }} · {{ ticket.clientId }}</div>
          <span class="mono" :style="capStyle"
            >EFFORT {{ ticket.effort }} pts · IMPACT {{ ticket.impact }} · score
            {{ priorityScore(ticket) }}</span
          >
        </div>
      </div>

      <!-- labels : sélection multiple guidée -->
      <div style="margin-top: 14px">
        <span class="mono" :style="capStyle">LABELS</span>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px">
          <button
            v-for="l in LABEL_CATALOG"
            :key="l.id"
            type="button"
            :title="isActive(l) ? 'Retirer ce label' : 'Ajouter ce label'"
            :style="{
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              padding: 0,
              opacity: isActive(l) ? 1 : 0.4,
            }"
            @click="toggleLabel(l)"
          >
            <VChip :kind="l.kind">{{ l.name }}</VChip>
          </button>
        </div>
      </div>

      <p
        v-if="saveMsg"
        class="mono"
        :style="{
          fontSize: '10.5px',
          marginTop: '10px',
          color: saveMsg.ok ? 'var(--accent)' : 'var(--err)',
        }"
      >
        {{ saveMsg.ok ? '✓ ' : '⚠ ' }}{{ saveMsg.text }}
      </p>
      <p
        v-if="syncMsg"
        class="mono"
        :style="{
          fontSize: '10.5px',
          marginTop: '4px',
          color: syncMsg.ok ? 'var(--accent)' : 'var(--err)',
        }"
      >
        {{ syncMsg.ok ? '↗ ' : '⚠ ' }}{{ syncMsg.text }}
      </p>
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
