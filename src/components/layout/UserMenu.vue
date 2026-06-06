<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { VChip } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useDetailStore } from '@/stores/detail'
import { useAvatar } from '@/composables/useAvatar'
import { setLocale } from '@/i18n'
import SettingsPanel from '@/views/settings/SettingsPanel.vue'

const router = useRouter()
const { t, locale } = useI18n()
const auth = useAuthStore()
const { displayName, email, provider } = storeToRefs(auth)
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const detail = useDetailStore()
const { src, initials, failed, onError } = useAvatar()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
onClickOutside(root, () => (open.value = false))

function openSettings() {
  open.value = false
  detail.open({
    icon: '⚙',
    title: t('settings.title'),
    sub: email.value ?? t('menu.demo'),
    component: markRaw(SettingsPanel),
  })
}

function toggleLocale() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr')
}

async function logout() {
  open.value = false
  await auth.signOut()
  router.push({ name: 'login' })
}

const rowStyle =
  'display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;background:none;border:0;color:var(--ink);cursor:pointer;font-family:inherit;font-size:12.5px;text-align:left'
</script>

<template>
  <div ref="root" style="position: relative; border-top: 1px solid var(--line-2)">
    <!-- Bouton avatar -->
    <button
      type="button"
      style="
        display: flex;
        align-items: center;
        gap: 9px;
        width: 100%;
        padding: 10px 14px;
        background: none;
        border: 0;
        color: var(--ink);
        cursor: pointer;
        text-align: left;
      "
      @click="open = !open"
    >
      <span
        class="mono"
        style="
          width: 28px;
          height: 28px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--fill-2);
          border: 1px solid var(--line);
          display: grid;
          place-items: center;
          font-size: 11px;
          flex: none;
        "
      >
        <img
          v-if="src && !failed"
          :src="src"
          alt=""
          style="width: 100%; height: 100%; object-fit: cover"
          @error="onError"
        />
        <template v-else>{{ initials }}</template>
      </span>
      <span style="flex: 1; min-width: 0">
        <span
          style="
            display: block;
            font-size: 12.5px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
          >{{ displayName }}</span
        >
        <span class="mono" style="display: block; font-size: 9.5px; color: var(--muted)">{{
          auth.demoMode ? t('menu.demo') : provider
        }}</span>
      </span>
      <span style="color: var(--muted); font-size: 12px">{{ open ? '▾' : '▴' }}</span>
    </button>

    <!-- Popover -->
    <div
      v-if="open"
      style="
        position: absolute;
        bottom: calc(100% + 6px);
        left: 12px;
        right: 12px;
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 12px;
        box-shadow: var(--shadow);
        overflow: hidden;
        z-index: 30;
      "
    >
      <!-- En-tête -->
      <div
        style="
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-bottom: 1px solid var(--line-2);
        "
      >
        <span
          class="mono"
          style="
            width: 34px;
            height: 34px;
            border-radius: 9px;
            overflow: hidden;
            background: var(--fill-2);
            border: 1px solid var(--line);
            display: grid;
            place-items: center;
            font-size: 13px;
            flex: none;
          "
        >
          <img
            v-if="src && !failed"
            :src="src"
            alt=""
            style="width: 100%; height: 100%; object-fit: cover"
            @error="onError"
          />
          <template v-else>{{ initials }}</template>
        </span>
        <div style="min-width: 0">
          <div
            style="
              font-size: 13px;
              font-weight: 700;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ displayName }}
          </div>
          <div class="mono" style="font-size: 10px; color: var(--muted)">
            {{ email ?? t('menu.demo') }}
          </div>
        </div>
      </div>

      <!-- Paramètres -->
      <button type="button" :style="rowStyle" @click="openSettings">
        <span style="width: 16px; text-align: center">⚙</span>
        {{ t('menu.settings') }}
      </button>

      <!-- Thème -->
      <div :style="rowStyle" style="cursor: default">
        <span style="width: 16px; text-align: center">{{ theme === 'dark' ? '☾' : '☀' }}</span>
        <span style="flex: 1">{{ t('menu.theme') }}</span>
        <button
          type="button"
          class="mono"
          style="
            font-size: 10.5px;
            border: 1px solid var(--line);
            background: var(--paper2);
            color: var(--ink);
            border-radius: 7px;
            padding: 3px 9px;
            cursor: pointer;
          "
          @click="themeStore.toggle()"
        >
          {{ theme === 'dark' ? t('theme.dark') : t('theme.light') }}
        </button>
      </div>

      <!-- Langue -->
      <div :style="rowStyle" style="cursor: default">
        <span style="width: 16px; text-align: center">⊕</span>
        <span style="flex: 1">{{ t('menu.language') }}</span>
        <button
          type="button"
          class="mono"
          style="
            font-size: 10.5px;
            border: 1px solid var(--line);
            background: var(--paper2);
            color: var(--ink);
            border-radius: 7px;
            padding: 3px 9px;
            cursor: pointer;
          "
          @click="toggleLocale"
        >
          {{ locale === 'fr' ? 'FR' : 'EN' }}
        </button>
      </div>

      <!-- Déconnexion -->
      <template v-if="!auth.demoMode">
        <div style="height: 1px; background: var(--line-2)" />
        <button type="button" :style="rowStyle" style="color: var(--err)" @click="logout">
          <span style="width: 16px; text-align: center">⏻</span>
          {{ t('menu.logout') }}
        </button>
      </template>
      <div v-else style="padding: 8px 12px">
        <VChip :dot="false">{{ t('menu.demo') }}</VChip>
      </div>
    </div>
  </div>
</template>
