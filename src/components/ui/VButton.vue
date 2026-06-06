<script setup lang="ts">
/** Bouton du design system (primaire ou secondaire). */
defineProps<{ primary?: boolean }>()
defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button class="btnw" :class="{ pri: primary }" type="button" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
