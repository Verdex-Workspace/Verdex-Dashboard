<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { VBar, VBars, VBox, VButton, VChip, VFrame, VKpi, VTabs } from '@/components/ui'
import { fetchToolDetail } from '@/services/projects.service'
import GithubWriteForm from './GithubWriteForm.vue'
import type { Environment, StatusKind, Tool, ToolDetail } from '@/types'

const props = defineProps<{ tool: Tool; onUntrack?: (tool: Tool) => void }>()

const ENV_KIND: Record<Environment, StatusKind> = {
  prod: 'ok',
  staging: 'warn',
  dev: 'info',
}

const detail = ref<ToolDetail | null>(null)
const loading = ref(true)

const tabs = computed(() => {
  const base = [
    { id: 'apercu', label: 'Aperçu' },
    { id: 'readme', label: 'README' },
    { id: 'commits', label: `Commits` },
    { id: 'pr', label: `PR · ${detail.value?.pullRequests.length ?? 0}` },
    { id: 'issues', label: `Issues · ${detail.value?.issues.length ?? 0}` },
    { id: 'deploy', label: 'Déploiements' },
  ]
  if (props.tool.repo) base.push({ id: 'create', label: '✎ Créer' })
  return base
})
const tab = ref('apercu')

onMounted(async () => {
  detail.value = await fetchToolDetail(props.tool.id, props.tool.repo)
  loading.value = false
})
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px">
      <div style="flex: 1; min-width: 0; overflow-x: auto">
        <VTabs v-model="tab" :items="tabs" />
      </div>
      <button
        v-if="onUntrack && tool.repo"
        type="button"
        class="mono"
        style="
          flex: none;
          font-size: 10.5px;
          border: 1px solid var(--line);
          background: var(--paper2);
          color: var(--err);
          border-radius: 8px;
          padding: 5px 10px;
          cursor: pointer;
          white-space: nowrap;
        "
        title="Retirer ce dépôt du suivi"
        @click="onUntrack(tool)"
      >
        ✕ ne plus suivre
      </button>
    </div>

    <p v-if="loading" class="mono" style="color: var(--muted)">Chargement…</p>

    <template v-else-if="detail">
      <!-- Aperçu -->
      <div v-if="tab === 'apercu'" style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; gap: 10px; flex-wrap: wrap">
          <VChip :kind="ENV_KIND[tool.env]">{{ tool.env }} · en ligne</VChip>
          <VChip>v{{ tool.version }}</VChip>
          <VChip>{{ tool.stack }}</VChip>
          <VChip>port {{ detail.port }}</VChip>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap">
          <VKpi
            v-for="m in detail.metrics"
            :key="m.key"
            :label="m.key"
            :value="m.value"
            :kind="m.kind"
          />
        </div>

        <VFrame cap="Description" tag="repo">
          <p style="font-size: 13px; line-height: 1.5; margin: 0">{{ detail.description }}</p>
        </VFrame>

        <div class="grid2">
          <VFrame cap="Dépendances" tag="package">
            <div style="display: flex; flex-direction: column; gap: 6px">
              <div
                v-for="d in detail.dependencies"
                :key="d.name"
                style="display: flex; align-items: center; gap: 8px"
              >
                <span class="mono" style="font-size: 11px">{{ d.name }}</span>
                <span style="flex: 1" />
                <VChip :kind="d.upToDate ? 'ok' : 'warn'">{{
                  d.upToDate ? 'à jour' : 'à mettre à jour'
                }}</VChip>
              </div>
            </div>
          </VFrame>
          <VFrame cap="Liens" tag="">
            <div style="display: flex; flex-direction: column; gap: 7px">
              <a
                v-for="l in detail.links"
                :key="l.label"
                :href="l.url"
                class="mono"
                style="font-size: 11.5px; color: var(--accent); text-decoration: none"
                >{{ l.label }}</a
              >
            </div>
          </VFrame>
        </div>
      </div>

      <!-- README -->
      <VFrame
        v-else-if="tab === 'readme'"
        cap="README.md"
        :tag="detail.readme ? 'GitHub' : 'markdown'"
      >
        <pre
          v-if="detail.readme"
          class="mono"
          style="
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 11.5px;
            line-height: 1.55;
            margin: 0;
            color: var(--ink);
            max-height: 60vh;
            overflow: auto;
          "
          >{{ detail.readme }}</pre
        >
        <template v-else>
          <VBar w="55%" variant="dk" />
          <div style="height: 12px" />
          <VBars :widths="['100%', '96%', '88%']" />
          <div style="height: 14px" />
          <VBox plain label="bloc de code" :min-height="70" style="padding: 22px 12px">
            <VBars :widths="['70%', '50%', '62%']" sm variant="ac" />
          </VBox>
          <div style="height: 12px" />
          <VBars :widths="['92%', '80%']" />
        </template>
      </VFrame>

      <!-- Commits -->
      <div v-else-if="tab === 'commits'" style="display: flex; flex-direction: column; gap: 8px">
        <VBox
          v-for="c in detail.commits"
          :key="c.hash"
          plain
          :min-height="42"
          style="display: flex; align-items: center; gap: 10px; padding: 0 12px"
        >
          <span style="width: 7px; height: 7px; border-radius: 50%; background: var(--accent)" />
          <span style="font-size: 12.5px">{{ c.message }}</span>
          <span class="mono" style="margin-left: auto; font-size: 10.5px; color: var(--muted)"
            >{{ c.hash }} · {{ c.age }}</span
          >
        </VBox>
      </div>

      <!-- Pull requests -->
      <div v-else-if="tab === 'pr'" style="display: flex; flex-direction: column; gap: 9px">
        <p v-if="!detail.pullRequests.length" class="mono" style="color: var(--muted)">
          Aucune PR ouverte.
        </p>
        <VBox
          v-for="p in detail.pullRequests"
          :key="p.id"
          :min-height="50"
          style="display: flex; align-items: center; gap: 11px; padding: 0 12px"
        >
          <span style="font-size: 16px">⑂</span>
          <div style="display: flex; flex-direction: column; gap: 3px">
            <b style="font-size: 13px">#{{ p.id }} {{ p.title }}</b>
            <span class="mono" style="font-size: 10.5px; color: var(--muted)">{{ p.detail }}</span>
          </div>
          <span style="margin-left: auto"
            ><VChip :kind="p.status">{{ p.status === 'ok' ? 'open' : 'bloqué' }}</VChip></span
          >
        </VBox>
      </div>

      <!-- Issues -->
      <div v-else-if="tab === 'issues'" style="display: flex; flex-direction: column; gap: 9px">
        <VBox
          v-for="i in detail.issues"
          :key="i.id"
          :min-height="46"
          style="display: flex; align-items: center; gap: 11px; padding: 0 12px"
        >
          <VChip :kind="i.kind">●</VChip>
          <span style="font-size: 13px">{{ i.title }}</span>
          <span class="mono" style="margin-left: auto; font-size: 10.5px; color: var(--muted)">{{
            i.meta
          }}</span>
        </VBox>
      </div>

      <!-- Déploiements -->
      <div v-else-if="tab === 'deploy'" style="display: flex; flex-direction: column; gap: 9px">
        <VBox
          v-for="(d, idx) in detail.deployments"
          :key="idx"
          :min-height="46"
          style="display: flex; align-items: center; gap: 11px; padding: 0 12px"
        >
          <VChip :kind="ENV_KIND[d.env]">{{ d.env }}</VChip>
          <span class="mono" style="font-size: 12px">{{ d.version }}</span>
          <span class="mono" style="font-size: 10.5px; color: var(--muted)">{{ d.when }}</span>
          <span style="margin-left: auto"><VButton>rollback</VButton></span>
        </VBox>
      </div>
    </template>

    <!-- Créer (écriture GitHub) — indépendant du détail -->
    <GithubWriteForm v-if="!loading && tab === 'create' && tool.repo" :repo="tool.repo" />
  </div>
</template>
