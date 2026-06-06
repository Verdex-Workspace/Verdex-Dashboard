<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDetailStore } from '@/stores/detail'

const detail = useDetailStore()
const { isOpen, panel } = storeToRefs(detail)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') detail.close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="scrim" :class="{ show: isOpen }" @click="detail.close()" />
  <aside class="sover" :class="{ show: isOpen }" :aria-hidden="!isOpen">
    <template v-if="panel">
      <div class="sover-h">
        <span class="icbox">{{ panel.icon ?? '▤' }}</span>
        <div>
          <div style="font-weight: 700; font-size: 15px">{{ panel.title }}</div>
          <div class="mono" style="font-size: 11px; color: var(--muted)">{{ panel.sub }}</div>
        </div>
        <button class="xbtn" type="button" title="Fermer (Esc)" @click="detail.close()">✕</button>
      </div>
      <div class="sover-b">
        <component :is="panel.component" v-bind="panel.props" />
      </div>
    </template>
  </aside>
</template>
