<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBars, VBox, VButton, VChip, VFrame, VSheetHeader } from '@/components/ui'
import { fetchAudit } from '@/services/cyber.service'
import { useUiStore } from '@/stores/ui'
import { useDetailStore } from '@/stores/detail'
import CyberReport from './cyber/CyberReport.vue'
import VulnerabilityDetailPanel from './cyber/VulnerabilityDetailPanel.vue'
import type { AuditData, Vulnerability } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)
const detail = useDetailStore()

const STEPS = [
  { key: 'Sources', sub: 'documents & accès' },
  { key: 'Analyse IA', sub: 'NotebookLM' },
  { key: 'Schémas', sub: 'infra · réseau · ports' },
  { key: 'Audit', sub: 'scan & contrôles' },
  { key: 'Rapport', sub: 'vulnérabilités & plan' },
]
const SCHEMAS = [
  { icon: '⬡', title: 'Topologie infra', sub: 'serveurs · conteneurs' },
  { icon: '⇄', title: 'Schéma réseau', sub: 'VLAN · firewall · DMZ' },
  { icon: '▢', title: 'Port mapping', sub: 'exposés ↔ internes' },
]

const data = ref<AuditData | null>(null)
const loading = ref(true)
const step = ref(0)
const running = ref(false)
const progress = ref(0)

async function load() {
  loading.value = true
  data.value = await fetchAudit(activeClient.value.id)
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)

const stepKey = computed(() => STEPS[step.value].key.toLowerCase())

function launchAudit() {
  running.value = true
  progress.value = 0
  const timer = setInterval(() => {
    progress.value += 12
    if (progress.value >= 100) {
      clearInterval(timer)
      running.value = false
      step.value = 4
    }
  }, 120)
}

function openVuln(vulnerability: Vulnerability) {
  detail.open({
    icon: '⛨',
    title: vulnerability.finding,
    sub: `${vulnerability.severityLabel} · CVSS ${vulnerability.cvss} · ${vulnerability.component}`,
    component: markRaw(VulnerabilityDetailPanel),
    props: { vulnerability },
  })
}
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Cybersécurité · pipeline d'audit"
      title="Audit de Sécurité"
      desc="Pipeline guidé : vous fournissez les documents → un assistant analyse et génère les schémas d'infra/réseau/ports → vous lancez l'audit → un rapport complet est rédigé (métriques, vulnérabilités, causes, remédiations, bénéfices)."
    />

    <!-- Stepper -->
    <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px">
      <button
        v-for="(s, i) in STEPS"
        :key="s.key"
        type="button"
        style="
          flex: 1;
          min-width: 120px;
          background: none;
          border: 0;
          cursor: pointer;
          text-align: left;
          padding: 0 8px;
        "
        @click="step = i"
      >
        <div style="display: flex; align-items: center; gap: 8px">
          <span
            class="mono"
            :style="{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              flex: 'none',
              display: 'grid',
              placeItems: 'center',
              fontSize: '11px',
              color: i <= step ? 'var(--accent-ink)' : 'var(--muted)',
              background: i <= step ? 'var(--accent)' : 'var(--fill)',
              border: '1.5px solid ' + (i <= step ? 'var(--accent)' : 'var(--line)'),
            }"
            >{{ i + 1 }}</span
          >
          <span
            v-if="i < STEPS.length - 1"
            :style="{
              flex: 1,
              height: '2px',
              background: i < step ? 'var(--accent)' : 'var(--line)',
            }"
          />
        </div>
        <div style="margin-top: 6px">
          <b :style="{ fontSize: '12.5px', color: i === step ? 'var(--ink)' : 'var(--muted)' }">{{
            s.key
          }}</b>
          <div class="mono" style="font-size: 9.5px; color: var(--muted)">{{ s.sub }}</div>
        </div>
      </button>
    </div>

    <VFrame v-if="data" chrome :title="`verdex.app / securite / ${stepKey}`">
      <!-- 0 · Sources -->
      <div v-if="step === 0" class="grid2">
        <VBox dash :min-height="180" style="display: grid; place-items: center; text-align: center">
          <div>
            <div style="font-size: 30px; color: var(--accent)">⇪</div>
            <div style="font-size: 15px; margin-top: 8px">Déposez vos documents</div>
            <div class="mono" style="font-size: 10.5px; color: var(--muted); margin-top: 6px">
              PDF · docker-compose · .env · diagrammes · README
            </div>
          </div>
        </VBox>
        <VFrame :cap="`Sources ingérées`" :tag="String(data.sources.length)">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div
              v-for="s in data.sources"
              :key="s.id"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span style="font-size: 14px">▤</span>
              <span class="mono" style="font-size: 11px; flex: 1">{{ s.name }}</span>
              <VChip :kind="s.status">{{ s.statusLabel }}</VChip>
            </div>
          </div>
        </VFrame>
      </div>

      <!-- 1 · Analyse IA -->
      <div v-else-if="step === 1" class="grid2">
        <VFrame cap="Synthèse" tag="IA">
          <VBars :widths="['100%', '94%', '88%', '70%']" />
          <div style="height: 10px" />
          <VBars :widths="['96%', '60%']" />
        </VFrame>
        <VFrame cap="Questions suggérées" tag="chat">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <VBox
              v-for="(q, i) in data.questions"
              :key="i"
              plain
              :min-height="34"
              style="display: flex; align-items: center; padding: 0 11px"
            >
              <span style="font-size: 12px; color: var(--accent)">↳ {{ q }}</span>
            </VBox>
          </div>
        </VFrame>
      </div>

      <!-- 2 · Schémas -->
      <div v-else-if="step === 2" class="grid3">
        <VFrame v-for="s in SCHEMAS" :key="s.title" :cap="s.title" tag="auto">
          <VBox dash :min-height="150" class="gridbg" style="display: grid; place-items: center">
            <div style="text-align: center">
              <div style="font-size: 24px; color: var(--accent)">{{ s.icon }}</div>
              <div class="mono" style="font-size: 9.5px; color: var(--muted); margin-top: 6px">
                {{ s.sub }}
              </div>
            </div>
          </VBox>
        </VFrame>
      </div>

      <!-- 3 · Audit -->
      <div v-else-if="step === 3" class="grid2">
        <VFrame cap="Périmètre de l'audit" tag="contrôles">
          <div style="display: flex; flex-direction: column; gap: 9px">
            <label
              v-for="c in data.checks"
              :key="c.id"
              style="display: flex; align-items: center; gap: 9px; cursor: pointer"
            >
              <span
                :style="{
                  width: '18px',
                  height: '18px',
                  borderRadius: '5px',
                  border: '1.5px solid var(--line)',
                  background: c.enabled ? 'var(--accent)' : 'transparent',
                  color: 'var(--accent-ink)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '11px',
                }"
                >{{ c.enabled ? '✓' : '' }}</span
              >
              <input v-model="c.enabled" type="checkbox" style="display: none" />
              <span style="font-size: 12.5px">{{ c.label }}</span>
            </label>
          </div>
        </VFrame>
        <div style="display: flex; flex-direction: column; gap: 12px">
          <VFrame cap="Lancement" tag="scan">
            <div style="text-align: center; padding: 10px 0">
              <VButton primary @click="launchAudit">⛨ Lancer l'audit complet</VButton>
              <div class="mono" style="font-size: 10px; color: var(--muted); margin-top: 10px">
                ≈ 4 min · 312 contrôles
              </div>
            </div>
          </VFrame>
          <VFrame v-if="running" cap="Progression" tag="live">
            <div style="height: 9px; border-radius: 5px; background: var(--line); overflow: hidden">
              <div
                :style="{
                  width: progress + '%',
                  height: '100%',
                  background: 'var(--accent)',
                  transition: 'width .12s',
                }"
              />
            </div>
            <span class="mono" style="font-size: 10.5px; color: var(--muted)"
              >scan en cours… {{ progress }}%</span
            >
          </VFrame>
        </div>
      </div>

      <!-- 4 · Rapport -->
      <CyberReport
        v-else
        :scores="data.scores"
        :vulnerabilities="data.vulnerabilities"
        @open="openVuln"
      />
    </VFrame>
  </div>
</template>
