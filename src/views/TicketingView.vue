<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Ticketing · style GitHub Projects"
    title="Tickets — Bugs & Améliorations"
    desc="Un seul backlog cross-outils, plusieurs vues sur les mêmes tickets : Kanban, Roadmap, Gantt et matrice priorisation/effort."
    :features="[
      'Kanban',
      'Roadmap',
      'Gantt',
      'Priorisation (impact × effort)',
      'Filtres',
      'Champs custom',
    ]"
  />
</template>
