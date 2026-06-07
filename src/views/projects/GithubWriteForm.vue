<script setup lang="ts">
import { reactive, ref } from 'vue'
import { VButton, VChip } from '@/components/ui'
import {
  githubWrite,
  type GithubWriteAction,
  type GithubWriteResult,
} from '@/services/github.service'

const props = defineProps<{ repo: string }>()

const ACTIONS: { id: GithubWriteAction; label: string }[] = [
  { id: 'issue', label: 'Issue' },
  { id: 'label', label: 'Label' },
  { id: 'milestone', label: 'Milestone' },
  { id: 'release', label: 'Release' },
]
const action = ref<GithubWriteAction>('issue')

const f = reactive({
  title: '',
  body: '',
  labels: '',
  name: '',
  color: '2ee59d',
  description: '',
  due: '',
  tag: '',
  draft: false,
})

const loading = ref(false)
const result = ref<{ ok: boolean; text: string; url: string | null } | null>(null)

function buildPayload(): Record<string, unknown> {
  switch (action.value) {
    case 'issue':
      return {
        title: f.title,
        body: f.body,
        labels: f.labels
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }
    case 'label':
      return { name: f.name, color: f.color.replace('#', ''), description: f.description }
    case 'milestone':
      return {
        title: f.title,
        description: f.description,
        ...(f.due ? { due_on: new Date(f.due).toISOString() } : {}),
      }
    case 'release':
      return { tag_name: f.tag, name: f.name || f.tag, body: f.body, draft: f.draft }
  }
}

function required(): boolean {
  if (action.value === 'issue' || action.value === 'milestone') return !!f.title.trim()
  if (action.value === 'label') return !!f.name.trim()
  if (action.value === 'release') return !!f.tag.trim()
  return false
}

async function submit() {
  if (!required()) {
    result.value = { ok: false, text: 'Champ requis manquant.', url: null }
    return
  }
  loading.value = true
  result.value = null
  try {
    const r: GithubWriteResult = await githubWrite(props.repo, action.value, buildPayload())
    result.value = {
      ok: true,
      text: `Créé${r.number ? ` · #${r.number}` : ''}${r.name ? ` — ${r.name}` : ''}`,
      url: r.url,
    }
    // réinitialise les champs texte
    Object.assign(f, {
      title: '',
      body: '',
      labels: '',
      name: '',
      description: '',
      due: '',
      tag: '',
    })
  } catch (e) {
    result.value = { ok: false, text: e instanceof Error ? e.message : 'Échec.', url: null }
  } finally {
    loading.value = false
  }
}

const input =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:12.5px;border-radius:9px;padding:9px 11px;outline:none'
const labelStyle = 'font-size:9.5px;color:var(--muted);font-family:var(--font-mono)'
const seg = (active: boolean) =>
  `font-family:var(--font-mono);font-size:11px;padding:6px 11px;border-radius:8px;cursor:pointer;border:1.5px solid ${active ? 'var(--accent)' : 'var(--line)'};background:${active ? 'color-mix(in oklab,var(--accent) 16%,transparent)' : 'var(--paper2)'};color:var(--ink)`
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- Sélecteur d'action -->
    <div style="display: flex; gap: 6px; flex-wrap: wrap">
      <button
        v-for="a in ACTIONS"
        :key="a.id"
        type="button"
        :style="seg(action === a.id)"
        @click="((action = a.id), (result = null))"
      >
        {{ a.label }}
      </button>
    </div>

    <form style="display: flex; flex-direction: column; gap: 10px" @submit.prevent="submit">
      <!-- Issue / Milestone : titre -->
      <label
        v-if="action === 'issue' || action === 'milestone'"
        style="display: flex; flex-direction: column; gap: 5px"
      >
        <span :style="labelStyle">TITRE *</span>
        <input v-model="f.title" type="text" :style="input" />
      </label>

      <!-- Label : nom + couleur -->
      <label v-if="action === 'label'" style="display: flex; flex-direction: column; gap: 5px">
        <span :style="labelStyle">NOM *</span>
        <input v-model="f.name" type="text" :style="input" />
      </label>
      <label v-if="action === 'label'" style="display: flex; flex-direction: column; gap: 5px">
        <span :style="labelStyle">COULEUR (hex)</span>
        <input v-model="f.color" type="text" :style="input" />
      </label>

      <!-- Release : tag + nom -->
      <label v-if="action === 'release'" style="display: flex; flex-direction: column; gap: 5px">
        <span :style="labelStyle">TAG *</span>
        <input v-model="f.tag" type="text" placeholder="v1.0.0" :style="input" />
      </label>
      <label v-if="action === 'release'" style="display: flex; flex-direction: column; gap: 5px">
        <span :style="labelStyle">NOM</span>
        <input v-model="f.name" type="text" :style="input" />
      </label>

      <!-- Labels (issue) -->
      <label v-if="action === 'issue'" style="display: flex; flex-direction: column; gap: 5px">
        <span :style="labelStyle">LABELS (séparés par des virgules)</span>
        <input v-model="f.labels" type="text" placeholder="bug, P1" :style="input" />
      </label>

      <!-- Échéance (milestone) -->
      <label v-if="action === 'milestone'" style="display: flex; flex-direction: column; gap: 5px">
        <span :style="labelStyle">ÉCHÉANCE</span>
        <input v-model="f.due" type="date" :style="input" />
      </label>

      <!-- Corps (issue / release / description label·milestone) -->
      <label
        v-if="action === 'issue' || action === 'release'"
        style="display: flex; flex-direction: column; gap: 5px"
      >
        <span :style="labelStyle">CORPS (markdown)</span>
        <textarea v-model="f.body" rows="4" :style="input" />
      </label>
      <label
        v-if="action === 'label' || action === 'milestone'"
        style="display: flex; flex-direction: column; gap: 5px"
      >
        <span :style="labelStyle">DESCRIPTION</span>
        <textarea v-model="f.description" rows="3" :style="input" />
      </label>

      <!-- Draft (release) -->
      <label
        v-if="action === 'release'"
        style="display: flex; align-items: center; gap: 8px; cursor: pointer"
      >
        <input v-model="f.draft" type="checkbox" />
        <span style="font-size: 12px">Brouillon</span>
      </label>

      <div style="display: flex; align-items: center; gap: 10px">
        <VButton primary @click="submit">{{ loading ? 'Envoi…' : 'Créer sur GitHub' }}</VButton>
        <a
          v-if="result?.url"
          :href="result.url"
          target="_blank"
          rel="noopener"
          class="mono"
          style="font-size: 11px; color: var(--accent)"
          >ouvrir ↗</a
        >
      </div>

      <p
        v-if="result"
        class="mono"
        :style="{ fontSize: '11px', margin: 0, color: result.ok ? 'var(--accent)' : 'var(--err)' }"
      >
        {{ result.ok ? '✓ ' : '⚠ ' }}{{ result.text }}
      </p>
    </form>

    <p class="mono" style="font-size: 10px; color: var(--muted); line-height: 1.5">
      Écriture réelle sur <VChip :dot="false">{{ repo }}</VChip> via le connecteur sécurisé.
      Nécessite un <code>GITHUB_TOKEN</code> avec les droits d'écriture (Issues / Contents).
    </p>
  </div>
</template>
