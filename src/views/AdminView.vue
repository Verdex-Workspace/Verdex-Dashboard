<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Admin · infrastructure"
    title="Admin / Infra"
    desc="Le sous-bassement technique : ports utilisés et leur exposition, configurations Docker (conteneurs, images, ressources), et scripts package.json de chaque projet."
    :features="[
      'Ports & exposition',
      'Conteneurs Docker',
      'docker-compose',
      'Scripts npm',
      'Détection de conflits',
    ]"
  />
</template>
