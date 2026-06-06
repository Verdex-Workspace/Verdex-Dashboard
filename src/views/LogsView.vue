<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Observabilité · agrégation"
    title="Logs & Métriques"
    desc="Toutes vos sources au même endroit : Grafana, Prometheus, Loki, Traefik, Docker, Vercel, Supabase, PostgreSQL, GitHub Actions. Vue unifiée ou drill-down par source."
    :features="[
      'Vue unifiée',
      'Par source',
      'Requêtes LogQL/PromQL',
      'Suivi live',
      'Connecteurs',
      'Panneaux Grafana',
    ]"
  />
</template>
