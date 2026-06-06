<script setup lang="ts">
interface TabItem {
  id: string
  label: string
}

/** Groupe d'onglets segmentés. `v-model` sur l'id actif. */
defineProps<{ items: TabItem[] }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="tabsw" role="tablist">
    <button
      v-for="it in items"
      :key="it.id"
      :class="{ on: model === it.id }"
      role="tab"
      :aria-selected="model === it.id"
      @click="model = it.id"
    >
      {{ it.label }}
    </button>
  </div>
</template>
