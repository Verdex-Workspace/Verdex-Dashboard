<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { VBox, VChip, VFrame, VKpi, VSheetHeader, VSpark } from '@/components/ui'
import { fetchProton } from '@/services/proton.service'
import { useUiStore } from '@/stores/ui'
import type { ProtonData, StatusKind } from '@/types'

const ui = useUiStore()
const { activeClient } = storeToRefs(ui)

const EVENT_COLOR: Record<StatusKind, string> = {
  ok: 'var(--accent)',
  warn: 'var(--warn)',
  err: 'var(--err)',
  info: 'var(--info)',
  neutral: 'var(--line)',
}

const data = ref<ProtonData | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  data.value = await fetchProton(activeClient.value.id)
  loading.value = false
}
onMounted(load)
watch(() => activeClient.value.id, load)
</script>

<template>
  <div class="sheet">
    <VSheetHeader
      badge="Proton Unlimited · remontées"
      title="Proton Unlimited"
      desc="Un coup d'œil consolidé sur votre abonnement : Mail, Calendar, Pass, Authenticator, Drive, Docs & Sheets. Lecture seule — ouverture en un clic vers l'app Proton concernée."
    />

    <template v-if="data">
      <!-- KPIs -->
      <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap">
        <VKpi
          v-for="kpi in data.kpis"
          :key="kpi.key"
          :label="kpi.key"
          :value="kpi.value"
          :kind="kpi.kind"
          :spark="kpi.spark"
        />
      </div>

      <div class="grid3">
        <!-- Mail -->
        <VFrame cap="Proton Mail" tag="✉">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
            <b style="font-size: 22px">{{ data.mail.unread }}</b>
            <VChip kind="warn">non lus</VChip>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div
              v-for="m in data.mail.items"
              :key="m.id"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span
                :style="{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: m.unread ? 'var(--accent)' : 'var(--line)',
                }"
              />
              <span style="font-size: 12px">{{ m.subject }}</span>
              <span class="mono" style="margin-left: auto; font-size: 10px; color: var(--muted)">{{
                m.time
              }}</span>
            </div>
          </div>
        </VFrame>

        <!-- Calendar -->
        <VFrame cap="Proton Calendar" tag="◷">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div
              v-for="e in data.calendar"
              :key="e.id"
              style="display: flex; align-items: center; gap: 9px; padding: 5px 0"
            >
              <span class="mono" style="font-size: 11px; width: 42px; color: var(--accent)">{{
                e.time
              }}</span>
              <span
                :style="{
                  width: '3px',
                  alignSelf: 'stretch',
                  borderRadius: '3px',
                  background: EVENT_COLOR[e.kind],
                }"
              />
              <span style="font-size: 12px">{{ e.title }}</span>
            </div>
          </div>
        </VFrame>

        <!-- Pass -->
        <VFrame cap="Proton Pass" tag="⚿">
          <div style="margin-bottom: 10px">
            <VKpi label="Identifiants" :value="String(data.pass.count)" kind="ok" />
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <VChip kind="err">{{ data.pass.reused }} réutilisés</VChip>
            <VChip kind="warn">{{ data.pass.weak }} faible</VChip>
          </div>
          <p class="mono" style="font-size: 10px; color: var(--muted); margin-top: 10px">
            Surveillance Dark Web + alias email intégrés.
          </p>
        </VFrame>

        <!-- Authenticator -->
        <VFrame cap="Proton Authenticator" tag="⧗">
          <div style="display: flex; flex-direction: column; gap: 7px">
            <div
              v-for="c in data.auth"
              :key="c.id"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span style="font-size: 12px; flex: 1">{{ c.service }}</span>
              <span
                class="mono"
                style="font-size: 14px; letter-spacing: 0.1em; color: var(--accent)"
                >{{ c.code }}</span
              >
              <span
                style="
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  border: 2px solid var(--line);
                  border-top-color: var(--accent);
                "
              />
            </div>
          </div>
        </VFrame>

        <!-- Drive -->
        <VFrame cap="Proton Drive" tag="☁">
          <VSpark accent :height="30" :bars="20" />
          <div style="display: flex; flex-direction: column; gap: 7px; margin-top: 10px">
            <div
              v-for="f in data.drive"
              :key="f.id"
              style="display: flex; align-items: center; gap: 9px"
            >
              <span style="font-size: 14px">▤</span>
              <span style="font-size: 12px; flex: 1">{{ f.name }}</span>
              <span class="mono" style="font-size: 10px; color: var(--muted)">{{ f.size }}</span>
            </div>
          </div>
        </VFrame>

        <!-- Docs & Sheets -->
        <VFrame cap="Docs & Sheets" tag="✍">
          <div style="display: flex; flex-direction: column; gap: 7px">
            <VBox
              v-for="d in data.docs"
              :key="d.id"
              plain
              :min-height="36"
              style="display: flex; align-items: center; gap: 9px; padding: 0 10px"
            >
              <VChip :dot="false">{{ d.kind }}</VChip>
              <span style="font-size: 12px">{{ d.name }}</span>
              <span class="mono" style="margin-left: auto; font-size: 9.5px; color: var(--muted)">{{
                d.when
              }}</span>
            </VBox>
          </div>
        </VFrame>
      </div>

      <p class="mono" style="color: var(--muted); font-size: 10.5px; margin-top: 14px">
        Chaque widget = remontée temps réel via le connecteur Proton (à brancher), sans dupliquer la
        donnée. Clic → ouvre l'app native.
      </p>
    </template>

    <p v-else-if="loading" class="mono" style="color: var(--muted); padding: 40px 0">Chargement…</p>
  </div>
</template>
