<script setup lang="ts">
/**
 * Cadre du design system. Deux ornements optionnels :
 * - `cap` + `tag` : libellé au-dessus du cadre
 * - `chrome` + `title` : barre de fenêtre (dots + titre)
 */
defineProps<{
  cap?: string
  tag?: string
  ghost?: boolean
  chrome?: boolean
  title?: string
}>()
</script>

<template>
  <div>
    <div v-if="cap" class="frame-cap">
      <span v-if="tag" class="tag" :class="{ ghost }">{{ tag }}</span>
      {{ cap }}
    </div>
    <div class="frame">
      <div v-if="chrome" class="frame-bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="ttl">{{ title }}</span>
      </div>
      <div class="frame-body">
        <slot />
      </div>
    </div>
  </div>
</template>
