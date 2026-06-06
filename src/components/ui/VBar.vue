<script setup lang="ts">
/** Barre placeholder (squelette de contenu). */
withDefaults(
  defineProps<{
    w?: string
    sm?: boolean
    variant?: 'dk' | 'ac'
  }>(),
  { w: '100%' },
)
</script>

<template>
  <div class="bar" :class="[{ sm }, variant]" :style="{ width: w }" />
</template>
