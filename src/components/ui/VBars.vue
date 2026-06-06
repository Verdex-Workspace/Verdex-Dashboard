<script setup lang="ts">
import VBar from './VBar.vue'

/** Ensemble de barres placeholder. */
withDefaults(
  defineProps<{
    widths?: string[]
    sm?: boolean
    variant?: 'dk' | 'ac'
  }>(),
  { widths: () => ['100%', '82%', '92%', '60%'] },
)
</script>

<template>
  <div class="bars">
    <VBar v-for="(w, i) in widths" :key="i" :w="w" :sm="sm" :variant="variant" />
  </div>
</template>
