<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Automations · n8n · Make · Zapier"
    title="Automations & Graphe"
    desc="Tous vos workflows, quel que soit le moteur. Visualisez le graphe, lancez une exécution, suivez les logs nœud par nœud, rejouez en cas d'échec."
    :features="[
      'Liste workflows',
      'Graphe interactif',
      'Exécution live',
      'Logs par nœud',
      'Rejouer',
    ]"
  />
</template>
