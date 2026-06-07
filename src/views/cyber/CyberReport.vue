<script setup lang="ts">
import { VBox, VChip, VFrame, VKpi } from '@/components/ui'
import type { AuditScore, Vulnerability } from '@/types'

const props = defineProps<{ scores: AuditScore[]; vulnerabilities: Vulnerability[] }>()
defineEmits<{ open: [vulnerability: Vulnerability] }>()

function esc(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string,
  )
}

/** Export PDF côté navigateur : ouvre une fenêtre d'impression dédiée au rapport. */
function exportPdf() {
  const kpis = props.scores
    .map((s) => `<div class="kpi"><b>${esc(s.value)}</b><span>${esc(s.key)}</span></div>`)
    .join('')
  const rows = props.vulnerabilities
    .map(
      (v) =>
        `<tr><td>${esc(v.severityLabel)}</td><td>${esc(v.cvss)}</td><td>${esc(v.finding)}</td><td>${esc(v.component)}</td></tr>` +
        `<tr class="detail"><td colspan="4"><b>Pourquoi :</b> ${esc(v.why)}<br><b>Remédiation :</b> ${esc(v.how)}</td></tr>`,
    )
    .join('')
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8" />
<title>Rapport d'audit — Verdex</title><style>
body{font-family:system-ui,sans-serif;color:#13261d;margin:32px;}
h1{color:#10996b;} .kpis{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0;}
.kpi{border:1px solid #cfd9d1;border-radius:8px;padding:10px 14px;}
.kpi b{display:block;font-size:20px;} .kpi span{font-size:11px;color:#6b776f;}
table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px;}
th,td{border:1px solid #dfe6e0;padding:7px 9px;text-align:left;vertical-align:top;}
th{background:#eef3f0;} tr.detail td{font-size:12px;color:#41514a;background:#f7faf8;}
</style></head><body>
<h1>Rapport d'audit de sécurité — Verdex</h1>
<p>Généré le ${new Date().toLocaleString('fr-FR')}</p>
<div class="kpis">${kpis}</div>
<table><thead><tr><th>Sévérité</th><th>CVSS</th><th>Finding</th><th>Composant</th></tr></thead>
<tbody>${rows}</tbody></table>
</body></html>`
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- Scores -->
    <div style="display: flex; gap: 12px; flex-wrap: wrap">
      <VKpi v-for="s in scores" :key="s.key" :label="s.key" :value="s.value" :kind="s.kind" />
    </div>

    <!-- Vulnérabilités -->
    <VFrame cap="Vulnérabilités" tag="priorisées par CVSS">
      <div class="legend" style="padding: 0 10px 6px">
        <span style="width: 80px">SÉVÉRITÉ</span>
        <span style="width: 56px">CVSS</span>
        <span style="flex: 1">FINDING</span>
        <span style="width: 110px">COMPOSANT</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px">
        <VBox
          v-for="v in vulnerabilities"
          :key="v.id"
          plain
          clickable
          :min-height="42"
          style="display: flex; align-items: center; gap: 10px; padding: 0 10px"
          @click="$emit('open', v)"
        >
          <span style="width: 80px"
            ><VChip :kind="v.severity">{{ v.severityLabel }}</VChip></span
          >
          <span
            class="mono"
            :style="{
              fontSize: '11px',
              width: '56px',
              color: v.severity === 'err' ? 'var(--err)' : 'var(--ink)',
            }"
            >{{ v.cvss }}</span
          >
          <span style="font-size: 12.5px; flex: 1; min-width: 0">{{ v.finding }}</span>
          <span class="mono" style="font-size: 10.5px; color: var(--muted); width: 110px">{{
            v.component
          }}</span>
        </VBox>
      </div>
    </VFrame>

    <!-- Export -->
    <VFrame cap="Export du rapport" tag="livrable">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <button class="btnw pri" type="button" @click="exportPdf">↓ Exporter en PDF</button>
        <button class="btnw" type="button" disabled style="opacity: 0.8; cursor: not-allowed">
          ☁ Proton Drive <VChip :dot="false">à venir</VChip>
        </button>
        <button class="btnw" type="button" disabled style="opacity: 0.8; cursor: not-allowed">
          ✉ Proton Mail <VChip :dot="false">à venir</VChip>
        </button>
      </div>
      <p
        class="mono"
        style="font-size: 10px; color: var(--muted); margin-top: 10px; line-height: 1.5"
      >
        Le rapport (schémas, métriques, logs probants, plan d'action priorisé et estimation
        d'effort) sera généré puis classé dans Proton Drive et notifié par Proton Mail — même «
        point d'entrée unique » que le Ticketing. Nécessite le connecteur Proton (backend).
      </p>
    </VFrame>
  </div>
</template>
