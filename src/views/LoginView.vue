<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { VButton } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.signInWithPassword(email.value, password.value)
    router.push({ name: 'overview' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('login.errorGeneric')
  } finally {
    loading.value = false
  }
}

async function github() {
  error.value = ''
  try {
    await auth.signInWithGitHub()
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('login.errorGithub')
  }
}

const inputStyle =
  'width:100%;border:1.5px solid var(--line);background:var(--paper2);color:var(--ink);font-family:var(--font-mono);font-size:13px;border-radius:9px;padding:10px 12px;outline:none'
</script>

<template>
  <div style="min-height: 100%; display: grid; place-items: center; padding: 24px">
    <div style="width: min(400px, 100%); display: flex; flex-direction: column; gap: 18px">
      <!-- Marque -->
      <div style="display: flex; align-items: center; gap: 12px; justify-content: center">
        <span
          class="mono"
          style="
            width: 38px;
            height: 38px;
            border-radius: 11px;
            font-size: 18px;
            font-weight: 700;
            background: var(--accent);
            color: var(--accent-ink);
            display: grid;
            place-items: center;
            box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent);
          "
          >V</span
        >
        <div>
          <b style="font-size: 18px; letter-spacing: 0.2px">Verdex</b>
          <small
            style="
              display: block;
              color: var(--muted);
              font-size: 10.5px;
              letter-spacing: 0.16em;
              text-transform: uppercase;
            "
            >{{ t('brand.tagline') }}</small
          >
        </div>
      </div>

      <div class="frame">
        <div class="frame-body" style="padding: 22px">
          <h1 style="font-size: 18px; margin: 0 0 4px">{{ t('login.title') }}</h1>
          <p class="desc" style="color: var(--muted); font-size: 12.5px; margin: 0 0 18px">
            {{ t('login.subtitle') }}
          </p>

          <form style="display: flex; flex-direction: column; gap: 12px" @submit.prevent="submit">
            <label style="display: flex; flex-direction: column; gap: 6px">
              <span
                class="mono"
                style="
                  font-size: 10px;
                  color: var(--muted);
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                "
                >{{ t('login.email') }}</span
              >
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :style="inputStyle"
              />
            </label>
            <label style="display: flex; flex-direction: column; gap: 6px">
              <span
                class="mono"
                style="
                  font-size: 10px;
                  color: var(--muted);
                  letter-spacing: 0.08em;
                  text-transform: uppercase;
                "
                >{{ t('login.password') }}</span
              >
              <input
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                :style="inputStyle"
              />
            </label>

            <p v-if="error" class="mono" style="font-size: 11px; color: var(--err); margin: 0">
              {{ error }}
            </p>

            <button
              class="btnw pri"
              type="submit"
              :disabled="loading"
              style="justify-content: center; padding: 10px"
            >
              {{ loading ? t('login.signingIn') : t('login.signIn') }}
            </button>
          </form>

          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin: 16px 0;
              color: var(--muted);
            "
          >
            <span style="flex: 1; height: 1px; background: var(--line-2)" />
            <span class="mono" style="font-size: 10px">{{ t('login.or') }}</span>
            <span style="flex: 1; height: 1px; background: var(--line-2)" />
          </div>

          <VButton style="width: 100%; justify-content: center; padding: 10px" @click="github">
            {{ t('login.github') }}
          </VButton>
        </div>
      </div>

      <p class="mono" style="font-size: 10px; color: var(--muted); text-align: center">
        {{ t('login.restricted') }}
      </p>
    </div>
  </div>
</template>
