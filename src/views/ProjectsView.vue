<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Module clé · panneau de détail"
    title="Projets & Outils"
    desc="État de tous vos outils par environnement. Clic sur une carte → panneau de détail glissant (README, versioning, commits, PR, issues, déploiements)."
    :features="[
      'Grille / Liste',
      'Slide-over détaillé',
      'README',
      'Commits',
      'PR',
      'Issues',
      'Déploiements',
    ]"
  />
</template>
