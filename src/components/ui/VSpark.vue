<script setup lang="ts">
import { computed } from 'vue'

/** Mini graphe à barres (sparkline). Hauteurs pseudo-aléatoires stables. */
const props = withDefaults(
  defineProps<{
    bars?: number
    accent?: boolean
    height?: number
    /** graine pour des barres déterministes (utile pour les snapshots/tests) */
    seed?: number
  }>(),
  { bars: 14, height: 34, seed: 1 },
)

const values = computed(() => {
  // Générateur déterministe simple (mulberry32-like) pour éviter le flicker.
  let s = props.seed * 2654435761
  return Array.from({ length: props.bars }, () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return 22 + ((s % 1000) / 1000) * 78
  })
})
</script>

<template>
  <div class="spark" :class="{ ac: accent }" :style="{ height: `${height}px` }">
    <i v-for="(v, i) in values" :key="i" :style="{ height: `${v}%` }" />
  </div>
</template>
