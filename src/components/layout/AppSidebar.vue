<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { NAV } from '@/data/navigation'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import type { Client } from '@/types'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const { clients, activeClient, sidebarOpen } = storeToRefs(ui)
const auth = useAuthStore()
const { demoMode, displayName } = storeToRefs(auth)

const clientMenuOpen = ref(false)

function pickClient(client: Client) {
  ui.selectClient(client)
  clientMenuOpen.value = false
}

async function logout() {
  await auth.signOut()
  router.push({ name: 'login' })
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

    <!-- Pied : utilisateur / déconnexion -->
    <div
      style="
        border-top: 1px solid var(--line-2);
        padding: 10px 14px;
        display: flex;
        align-items: center;
        gap: 9px;
      "
    >
      <span
        class="mono"
        style="
          width: 24px;
          height: 24px;
          border-radius: 7px;
          background: var(--fill-2);
          display: grid;
          place-items: center;
          font-size: 11px;
          flex: none;
        "
      >
        {{ demoMode ? '★' : displayName.charAt(0).toUpperCase() }}
      </span>
      <span
        class="mono"
        style="
          flex: 1;
          min-width: 0;
          font-size: 10.5px;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
        :title="displayName"
        >{{ displayName }}</span
      >
      <button
        v-if="!demoMode"
        type="button"
        class="mono"
        style="
          border: 1px solid var(--line-2);
          background: var(--paper);
          color: var(--ink);
          border-radius: 8px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 10px;
        "
        title="Se déconnecter"
        @click="logout"
      >
        ⏻
      </button>
    </div>
  </nav>
</template>
