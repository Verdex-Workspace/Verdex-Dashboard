<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Cybersécurité · flux IA"
    title="Audit de Sécurité"
    desc="Pipeline guidé : documents → analyse IA (type NotebookLM) → schémas infra/réseau/ports → audit → rapport complet (vulnérabilités, causes, remédiations, bénéfices)."
    :features="[
      'Sources',
      'Analyse IA',
      'Schémas auto',
      'Audit & scan',
      'Rapport CVSS',
      'Export PDF',
    ]"
  />
</template>
