<script setup lang="ts">
import ComingSoon from '@/components/ComingSoon.vue'
</script>

<template>
  <ComingSoon
    badge="Proton Unlimited · remontées"
    title="Proton Unlimited"
    desc="Vue consolidée de votre abonnement : Mail, Calendar, Pass, Authenticator, Drive, Docs & Sheets. Lecture seule, ouverture en un clic vers l'app Proton."
    :features="['Mail', 'Calendar', 'Pass', 'Authenticator', 'Drive', 'Docs & Sheets']"
  />
</template>
