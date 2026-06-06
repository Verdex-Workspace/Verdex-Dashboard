<script setup lang="ts">
/** En-tête de page (badge + titre + description). */
defineProps<{
  badge?: string
  title: string
  desc?: string
}>()
</script>

<template>
  <div class="sheet-h">
    <div v-if="badge" class="badge">{{ badge }}</div>
    <h1>{{ title }}</h1>
    <p v-if="desc" class="desc">{{ desc }}</p>
  </div>
</template>
