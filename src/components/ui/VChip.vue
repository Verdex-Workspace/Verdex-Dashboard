<script setup lang="ts">
import type { StatusKind } from '@/types'

/** Étiquette compacte avec pastille de statut optionnelle. */
withDefaults(
  defineProps<{
    kind?: StatusKind
    dot?: boolean
  }>(),
  { kind: 'neutral', dot: true },
)
</script>

<template>
  <span class="chip" :class="kind === 'neutral' ? '' : kind">
    <span v-if="dot" class="d" />
    <slot />
  </span>
</template>
