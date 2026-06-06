<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { VButton, VChip, VFrame } from '@/components/ui'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { setLocale, type Locale } from '@/i18n'

const { t, locale } = useI18n()
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const auth = useAuthStore()
const { displayName, email, provider } = storeToRefs(auth)

function changeLocale(next: Locale) {
  setLocale(next)
}

// --- changement de mot de passe ---
const newPassword = ref('')
const confirmPassword = ref('')
const pwMessage = ref<{ kind: 'ok' | 'err'; text: string } | null>(null)
const pwLoading = ref(false)

async function submitPassword() {
  pwMessage.value = null
  if (newPassword.value.length < 8) {
    pwMessage.value = { kind: 'err', text: t('settings.passwordTooShort') }
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    pwMessage.value = { kind: 'err', text: t('settings.passwordMismatch') }
    return
  }
  pwLoading.value = true
  try {
    await auth.updatePassword(newPassword.value)
    pwMessage.value = { kind: 'ok', text: t('settings.passwordUpdated') }
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    pwMessage.value = { kind: 'err', text: e instanceof Error ? e.message : 'Error' }
  } finally {
    pwLoading.value = false
  }
}

const inputStyle =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:12.5px;border-radius:9px;padding:9px 11px;outline:none'
const segBtn = (active: boolean) =>
  `font-family:var(--font-mono);font-size:11px;padding:6px 12px;border-radius:8px;cursor:pointer;border:1.5px solid ${active ? 'var(--accent)' : 'var(--line)'};background:${active ? 'color-mix(in oklab,var(--accent) 16%,transparent)' : 'var(--paper2)'};color:var(--ink)`
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px">
    <!-- Compte -->
    <VFrame :cap="t('settings.account')" tag="profil">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px">
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">{{
            t('settings.name')
          }}</span>
          <div style="font-size: 12.5px">{{ displayName }}</div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">{{
            t('settings.email')
          }}</span>
          <div style="font-size: 12.5px">{{ email ?? '—' }}</div>
        </div>
        <div>
          <span class="mono" style="font-size: 9.5px; color: var(--muted)">{{
            t('settings.provider')
          }}</span>
          <div>
            <VChip :dot="false">{{ provider }}</VChip>
          </div>
        </div>
      </div>
    </VFrame>

    <!-- Apparence -->
    <VFrame :cap="t('settings.appearance')" tag="thème">
      <div style="display: flex; align-items: center; gap: 10px">
        <span style="font-size: 12.5px; flex: 1">{{ t('settings.theme') }}</span>
        <button :style="segBtn(theme === 'dark')" @click="themeStore.set('dark')">
          ☾ {{ t('settings.themeDark') }}
        </button>
        <button :style="segBtn(theme === 'light')" @click="themeStore.set('light')">
          ☀ {{ t('settings.themeLight') }}
        </button>
      </div>
    </VFrame>

    <!-- Langue -->
    <VFrame :cap="t('settings.language')" tag="langue">
      <div style="display: flex; align-items: center; gap: 10px">
        <span style="font-size: 12.5px; flex: 1">{{ t('settings.language') }}</span>
        <button :style="segBtn(locale === 'fr')" @click="changeLocale('fr')">Français</button>
        <button :style="segBtn(locale === 'en')" @click="changeLocale('en')">English</button>
      </div>
    </VFrame>

    <!-- Sécurité -->
    <VFrame :cap="t('settings.security')" tag="mot de passe">
      <template v-if="provider === 'email'">
        <form
          style="display: flex; flex-direction: column; gap: 10px"
          @submit.prevent="submitPassword"
        >
          <label style="display: flex; flex-direction: column; gap: 6px">
            <span class="mono" style="font-size: 9.5px; color: var(--muted)">{{
              t('settings.newPassword')
            }}</span>
            <input
              v-model="newPassword"
              type="password"
              autocomplete="new-password"
              :style="inputStyle"
            />
          </label>
          <label style="display: flex; flex-direction: column; gap: 6px">
            <span class="mono" style="font-size: 9.5px; color: var(--muted)">{{
              t('settings.confirmPassword')
            }}</span>
            <input
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              :style="inputStyle"
            />
          </label>
          <p
            v-if="pwMessage"
            class="mono"
            :style="{
              fontSize: '11px',
              margin: 0,
              color: pwMessage.kind === 'ok' ? 'var(--accent)' : 'var(--err)',
            }"
          >
            {{ pwMessage.text }}
          </p>
          <div>
            <VButton primary @click="submitPassword">{{
              pwLoading ? t('settings.updating') : t('settings.changePassword')
            }}</VButton>
          </div>
        </form>
      </template>
      <p v-else class="mono" style="font-size: 11px; color: var(--muted)">
        {{ auth.demoMode ? t('menu.demo') : t('settings.emailOnly') }}
      </p>
    </VFrame>
  </div>
</template>
