<script setup lang="ts">
/** Conteneur carré d'icône. */
withDefaults(defineProps<{ size?: number }>(), { size: 34 })
</script>

<template>
  <span
    class="icbox"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.44}px` }"
  >
    <slot />
  </span>
</template>
