<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBox, VButton, VChip, VFrame, VSheetHeader } from '@/components/ui'
import {
  fetchAudit,
  listDocuments,
  uploadDocument,
  removeDocument,
  runSynthesis,
  runAudit,
  saveReport,
} from '@/services/cyber.service'
import { useUiStore } from '@/stores/ui'
import { useDetailStore } from '@/stores/detail'
import CyberReport from './cyber/CyberReport.vue'
import VulnerabilityDetailPanel from './cyber/VulnerabilityDetailPanel.vue'
import type { AuditData, AuditDocument, AuditSynthesis, Vulnerability } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)
const detail = useDetailStore()

const STEPS = [
  { key: 'Sources', sub: 'documents & accès' },
  { key: 'Analyse IA', sub: 'synthèse' },
  { key: 'Schémas', sub: 'infra · réseau · ports' },
  { key: 'Audit', sub: 'scan & contrôles' },
  { key: 'Rapport', sub: 'vulnérabilités & plan' },
]

const data = ref<AuditData | null>(null)
const documents = ref<AuditDocument[]>([])
const synthesis = ref<AuditSynthesis | null>(null)
const step = ref(0)
const uploading = ref(false)
const analyzing = ref(false)
const running = ref(false)
const auditError = ref('')
const synthWarning = ref('')
const auditWarning = ref('')
const notes = ref('')

async function load() {
  const [audit, docs] = await Promise.all([
    fetchAudit(activeClient.value.id),
    listDocuments(activeClient.value.id),
  ])
  data.value = audit
  documents.value = docs
}
onMounted(load)
watch(() => activeClient.value.id, load)

const stepKey = computed(() => STEPS[step.value].key.toLowerCase())

/** Étape 0 — téléversement des documents. */
async function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  uploading.value = true
  try {
    for (const file of Array.from(input.files)) {
      const doc = await uploadDocument(file, activeClient.value.id)
      documents.value = [...documents.value, doc]
    }
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function removeDoc(doc: AuditDocument) {
  await removeDocument(doc.id)
  documents.value = documents.value.filter((d) => d.id !== doc.id)
}

/** Étape 1 — synthèse IA des documents. */
async function analyze() {
  analyzing.value = true
  try {
    const r = await runSynthesis({ documents: documents.value, notes: notes.value })
    synthesis.value = r.data
    synthWarning.value = r.warning ?? ''
  } finally {
    analyzing.value = false
  }
}

/** Étape 3 — audit depuis la synthèse + documents, puis persistance. */
async function launchAudit() {
  if (!data.value) return
  running.value = true
  auditError.value = ''
  try {
    const checks = data.value.checks.filter((c) => c.enabled).map((c) => c.label)
    const r = await runAudit({
      synthesis: synthesis.value?.synthesis,
      documents: documents.value,
      checks,
      notes: notes.value,
    })
    const result = r.data
    auditWarning.value = r.warning ?? ''
    data.value = { ...data.value, scores: result.scores, vulnerabilities: result.vulnerabilities }
    await saveReport(
      result,
      { synthesis: synthesis.value?.synthesis, documents: documents.value.map((d) => d.name) },
      activeClient.value.id,
    )
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

const TOPO = [
  { key: 'servers', cap: 'Topologie infra', tag: 'serveurs' },
  { key: 'networks', cap: 'Schéma réseau', tag: 'réseaux' },
  { key: 'ports', cap: 'Port mapping', tag: 'exposés' },
] as const

const fieldStyle =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:12px;border-radius:8px;padding:8px 10px;outline:none'
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Cybersécurité · pipeline d'audit"
      title="Audit de Sécurité"
      desc="Pipeline guidé : vous fournissez les documents → une synthèse IA est produite et la topologie (infra/réseau/ports) extraite → vous lancez l'audit → un rapport complet est rédigé (métriques, vulnérabilités, causes, remédiations, bénéfices)."
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
        <label
          style="
            cursor: pointer;
            border: 1.5px dashed var(--line);
            border-radius: 12px;
            min-height: 180px;
            display: grid;
            place-items: center;
            text-align: center;
          "
        >
          <input type="file" multiple style="display: none" @change="onFiles" />
          <div>
            <div style="font-size: 30px; color: var(--accent)">⇪</div>
            <div style="font-size: 15px; margin-top: 8px">
              {{ uploading ? 'Téléversement…' : 'Déposez vos documents' }}
            </div>
            <div class="mono" style="font-size: 10.5px; color: var(--muted); margin-top: 6px">
              PDF · docker-compose · .env · diagrammes · README
            </div>
          </div>
        </label>
        <VFrame cap="Sources ingérées" :tag="String(documents.length)">
          <div v-if="documents.length" style="display: flex; flex-direction: column; gap: 8px">
            <div
              v-for="s in documents"
              :key="s.id"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span style="font-size: 14px">▤</span>
              <span class="mono" style="font-size: 11px; flex: 1">{{ s.name }}</span>
              <VChip :kind="s.status">{{ s.statusLabel }}</VChip>
              <button
                type="button"
                class="mono"
                style="
                  border: 1px solid var(--line);
                  background: var(--paper2);
                  color: var(--err);
                  border-radius: 7px;
                  padding: 2px 7px;
                  cursor: pointer;
                  font-size: 10px;
                "
                title="Retirer"
                @click="removeDoc(s)"
              >
                ✕
              </button>
            </div>
          </div>
          <span v-else class="mono" style="font-size: 11px; color: var(--muted)"
            >Aucun document — déposez-en pour démarrer.</span
          >
        </VFrame>
      </div>

      <!-- 1 · Analyse IA -->
      <div v-else-if="step === 1" class="grid2">
        <VFrame cap="Synthèse IA" tag="synthèse">
          <template v-if="synthesis">
            <p style="font-size: 12.5px; line-height: 1.6; margin: 0">{{ synthesis.synthesis }}</p>
            <p
              v-if="synthWarning"
              class="mono"
              style="font-size: 10px; color: var(--warn); margin-top: 10px"
            >
              ⚠ IA indisponible ({{ synthWarning }}) — synthèse de démonstration. Relancez «
              Analyser ».
            </p>
            <div style="margin-top: 10px">
              <VButton @click="analyze">{{
                analyzing ? 'Analyse…' : 'Relancer l’analyse'
              }}</VButton>
            </div>
          </template>
          <div v-else style="text-align: center; padding: 6px 0">
            <VButton primary @click="analyze">{{
              analyzing ? 'Analyse…' : 'Analyser les documents'
            }}</VButton>
            <div class="mono" style="font-size: 10px; color: var(--muted); margin-top: 10px">
              Produit une synthèse + extrait la topologie.
            </div>
          </div>
        </VFrame>
        <VFrame cap="Questions suggérées" tag="audit">
          <div
            v-if="synthesis?.questions.length"
            style="display: flex; flex-direction: column; gap: 8px"
          >
            <VBox
              v-for="(q, i) in synthesis.questions"
              :key="i"
              plain
              :min-height="34"
              style="display: flex; align-items: center; padding: 0 11px"
            >
              <span style="font-size: 12px; color: var(--accent)">↳ {{ q }}</span>
            </VBox>
          </div>
          <span v-else class="mono" style="font-size: 11px; color: var(--muted)"
            >Lancez l'analyse pour obtenir des pistes.</span
          >
        </VFrame>
      </div>

      <!-- 2 · Schémas (synthèse structurée) -->
      <div v-else-if="step === 2">
        <div v-if="synthesis" class="grid3">
          <VFrame v-for="t in TOPO" :key="t.key" :cap="t.cap" :tag="t.tag">
            <div style="display: flex; flex-direction: column; gap: 6px">
              <span
                v-for="(item, i) in synthesis.topology[t.key]"
                :key="i"
                class="mono"
                style="font-size: 11px"
                >• {{ item }}</span
              >
              <span
                v-if="!synthesis.topology[t.key].length"
                class="mono"
                style="font-size: 11px; color: var(--muted)"
                >—</span
              >
            </div>
          </VFrame>
        </div>
        <p v-else class="mono" style="font-size: 11.5px; color: var(--muted)">
          Lancez d'abord l'analyse (étape 2) pour extraire la topologie.
        </p>
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
          <VFrame cap="Contexte" tag="notes">
            <textarea
              v-model="notes"
              rows="3"
              placeholder="Contexte, périmètre, contraintes…"
              :style="fieldStyle"
            />
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
                analyse & rédaction du rapport…
              </div>
              <div
                v-else-if="auditError"
                class="mono"
                style="font-size: 10.5px; color: var(--err); margin-top: 10px"
              >
                ⚠ {{ auditError }}
              </div>
              <div
                v-else-if="auditWarning"
                class="mono"
                style="font-size: 10.5px; color: var(--warn); margin-top: 10px"
              >
                ⚠ IA indisponible ({{ auditWarning }}) — rapport de démonstration.
              </div>
              <div
                v-else
                class="mono"
                style="font-size: 10px; color: var(--muted); margin-top: 10px"
              >
                Audit depuis la synthèse · score CVSS recalculé localement
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
