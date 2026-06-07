<script setup lang="ts">
import { ref } from 'vue'
import { VButton, VFrame } from '@/components/ui'
import { trackRepo } from '@/services/projects.service'
import { useDetailStore } from '@/stores/detail'
import type { Tool } from '@/types'

const props = defineProps<{ onAdded?: (tool: Tool) => void }>()
const detail = useDetailStore()

const repo = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  const value = repo.value.trim()
  if (!/^[\w.-]+\/[\w.-]+$/.test(value)) {
    error.value = 'Format attendu : owner/nom-du-repo'
    return
  }
  loading.value = true
  try {
    const tool = await trackRepo(value)
    props.onAdded?.(tool)
    detail.close()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Échec du suivi.'
  } finally {
    loading.value = false
  }
}

const inputStyle =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:13px;border-radius:9px;padding:10px 12px;outline:none'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <VFrame cap="Dépôt GitHub" tag="owner/name">
      <form style="display: flex; flex-direction: column; gap: 12px" @submit.prevent="submit">
        <input
          v-model="repo"
          type="text"
          placeholder="Verdex-Workspace/mon-projet"
          :style="inputStyle"
          autofocus
        />
        <p v-if="error" class="mono" style="font-size: 11px; color: var(--err); margin: 0">
          {{ error }}
        </p>
        <div>
          <VButton primary @click="submit">{{ loading ? 'Ajout…' : '+ Suivre ce dépôt' }}</VButton>
        </div>
      </form>
    </VFrame>
    <p class="mono" style="font-size: 10.5px; color: var(--muted); line-height: 1.5">
      Les métadonnées (nom, langage, PR/issues ouvertes) sont récupérées depuis GitHub. Le détail
      (commits, PR, issues, README, déploiements) est ensuite remonté en temps réel.
    </p>
  </div>
</template>
