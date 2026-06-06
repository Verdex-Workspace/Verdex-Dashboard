<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NAV } from '@/data/navigation'
import { useUiStore } from '@/stores/ui'
import type { Client } from '@/types'

const route = useRoute()
const ui = useUiStore()
const { clients, activeClient, sidebarOpen } = storeToRefs(ui)

const clientMenuOpen = ref(false)

function pickClient(client: Client) {
  ui.selectClient(client)
  clientMenuOpen.value = false
}
</script>

<template>
  <nav class="side" :class="{ open: sidebarOpen }" aria-label="Navigation principale">
    <div class="brand">
      <span class="glyph">V</span>
      <div>
        <b>Verdex</b>
        <small>dashboard</small>
      </div>
    </div>

    <button class="client" type="button" @click="clientMenuOpen = !clientMenuOpen">
      <span class="av">{{ activeClient.avatar }}</span>
      <span class="nm">
        {{ activeClient.name }}
        <em>{{ activeClient.sub }}</em>
      </span>
      <span class="chev">{{ clientMenuOpen ? '▴' : '▾' }}</span>
    </button>

    <div v-if="clientMenuOpen" class="client-pop">
      <button v-for="c in clients" :key="c.id" type="button" @click="pickClient(c)">
        <span class="av">{{ c.avatar }}</span>
        <span style="font-size: 12px; font-weight: 600">
          {{ c.name }}
          <em
            class="mono"
            style="display: block; font-style: normal; color: var(--muted); font-size: 10px"
            >{{ c.sub }}</em
          >
        </span>
      </button>
    </div>

    <div class="navscroll">
      <div v-for="g in NAV" :key="g.group">
        <div class="navgrp">{{ g.group }}</div>
        <RouterLink
          v-for="it in g.items"
          :key="it.id"
          :to="{ name: it.id }"
          class="navitem"
          :class="{ on: route.name === it.id }"
          @click="ui.closeSidebar()"
        >
          <span class="ic">{{ it.icon }}</span>
          {{ it.label }}
          <span v-if="it.shortcut" class="kx">{{ it.shortcut }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
