<script setup lang="ts">
import { VBox, VChip, VFrame, VSheetHeader } from '@/components/ui'

/**
 * Gabarit de module en construction. Affiche l'en-tête défini dans le design
 * et la liste des fonctionnalités prévues, en attendant l'implémentation.
 */
defineProps<{
  badge: string
  title: string
  desc: string
  features: string[]
}>()
</script>

<template>
  <div class="sheet">
    <VSheetHeader :badge="badge" :title="title" :desc="desc" />
    <VFrame cap="Aperçu du module" tag="à venir">
      <VBox
        dash
        :min-height="120"
        class="gridbg"
        style="display: grid; place-items: center; text-align: center"
      >
        <div>
          <div style="font-size: 28px; color: var(--accent)">⌁</div>
          <p class="mono" style="font-size: 12px; color: var(--muted); margin-top: 8px">
            Module défini dans les wireframes — implémentation planifiée.
          </p>
        </div>
      </VBox>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px">
        <VChip v-for="f in features" :key="f">{{ f }}</VChip>
      </div>
    </VFrame>
  </div>
</template>
