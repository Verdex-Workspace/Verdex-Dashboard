<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBars, VBox, VButton, VChip, VFrame, VSheetHeader } from '@/components/ui'
import { fetchAudit, runAudit, saveReport } from '@/services/cyber.service'
import { fetchTools } from '@/services/projects.service'
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
const auditError = ref('')
const repos = ref<{ id: string; name: string; repo: string }[]>([])
const targetRepo = ref('')
const notes = ref('')

async function load() {
  loading.value = true
  const [audit, tls] = await Promise.all([
    fetchAudit(activeClient.value.id),
    fetchTools(activeClient.value.id),
  ])
  data.value = audit
  repos.value = tls
    .filter((t) => t.repo)
    .map((t) => ({ id: t.id, name: t.name, repo: t.repo as string }))
  targetRepo.value = repos.value[0]?.repo ?? ''
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)

const stepKey = computed(() => STEPS[step.value].key.toLowerCase())

/** Lance un audit réel (repli mock transparent) puis affiche le rapport. */
async function launchAudit() {
  if (!data.value) return
  running.value = true
  auditError.value = ''
  try {
    const checks = data.value.checks.filter((c) => c.enabled).map((c) => c.label)
    const result = await runAudit({
      repo: targetRepo.value || null,
      checks,
      notes: notes.value,
    })
    data.value = { ...data.value, scores: result.scores, vulnerabilities: result.vulnerabilities }
    await saveReport(result, targetRepo.value || null, activeClient.value.id)
    step.value = 4
  } catch (e) {
    auditError.value = e instanceof Error ? e.message : "L'audit a échoué."
  } finally {
    running.value = false
  }
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

const selectStyle =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:12px;border-radius:8px;padding:8px 10px;outline:none'
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
          <VFrame cap="Cible & contexte" tag="dépôt">
            <label style="display: flex; flex-direction: column; gap: 5px">
              <span class="mono" style="font-size: 9.5px; color: var(--muted)"
                >DÉPÔT À AUDITER</span
              >
              <select v-model="targetRepo" :style="selectStyle" aria-label="Dépôt à auditer">
                <option value="">— aucun (notes uniquement)</option>
                <option v-for="r in repos" :key="r.id" :value="r.repo">{{ r.repo }}</option>
              </select>
            </label>
            <label style="display: flex; flex-direction: column; gap: 5px; margin-top: 9px">
              <span class="mono" style="font-size: 9.5px; color: var(--muted)"
                >NOTES (CONTEXTE)</span
              >
              <textarea
                v-model="notes"
                rows="3"
                placeholder="Contexte, périmètre, contraintes…"
                :style="selectStyle"
              />
            </label>
          </VFrame>
          <VFrame cap="Lancement" tag="scan">
            <div style="text-align: center; padding: 10px 0">
              <VButton primary @click="launchAudit">{{
                running ? 'Audit en cours…' : '⛨ Lancer l’audit complet'
              }}</VButton>
              <div
                v-if="running"
                class="mono"
                style="font-size: 10.5px; color: var(--muted); margin-top: 10px"
              >
                analyse des signaux & rédaction du rapport…
              </div>
              <div
                v-else-if="auditError"
                class="mono"
                style="font-size: 10.5px; color: var(--err); margin-top: 10px"
              >
                ⚠ {{ auditError }}
              </div>
              <div
                v-else
                class="mono"
                style="font-size: 10px; color: var(--muted); margin-top: 10px"
              >
                Signaux lecture seule · score CVSS recalculé localement
              </div>
            </div>
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
