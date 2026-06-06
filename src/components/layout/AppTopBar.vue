<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useUiStore } from '@/stores/ui'
import { labelOf } from '@/data/navigation'

const route = useRoute()
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const ui = useUiStore()
const { activeClient } = storeToRefs(ui)

const moduleLabel = computed(() => labelOf(String(route.name ?? '')))
</script>

<template>
  <header class="top">
    <button
      class="tg"
      type="button"
      style="padding: 6px 9px"
      aria-label="Menu"
      @click="ui.toggleSidebar()"
    >
      ☰
    </button>
    <span class="crumb">
      {{ activeClient.name }} <span style="opacity: 0.5">/</span> <b>{{ moduleLabel }}</b>
    </span>
    <span class="sp" />
    <button class="tg" type="button" @click="themeStore.toggle()">
      {{ theme === 'dark' ? '☾ sombre' : '☀ clair' }}
    </button>
  </header>
</template>
