<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Analyse · perfs & opportunités"
    title="Performance & Gains"
    desc="Performance technique de vos apps (latence, erreurs, Web Vitals) et gains potentiels : tâches à optimiser via workflows IA, bénéfice estimé."
    :features="[
      'P95 / erreurs',
      'Web Vitals',
      'Tendance 30j',
      'Opportunités IA',
      'ROI estimé',
      'Avant / Après',
    ]"
  />
</template>
