<script setup lang="ts">
/** Conteneur "boîte" du design system, variantes plain/dash, cliquable. */
defineProps<{
  label?: string
  minHeight?: number
  dash?: boolean
  plain?: boolean
  clickable?: boolean
}>()
defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <div
    class="wbox"
    :class="{ dash, plain, clickable }"
    :style="{ minHeight: minHeight ? `${minHeight}px` : undefined }"
    @click="$emit('click', $event)"
  >
    <span v-if="label" class="wlabel">{{ label }}</span>
    <slot />
  </div>
</template>
