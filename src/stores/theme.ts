import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'verdex:theme'

function initialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** Gère le thème sombre/clair et le persiste. */
export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(initialTheme())

  function apply(value: Theme) {
    document.documentElement.dataset.theme = value
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function set(value: Theme) {
    theme.value = value
  }

  watch(
    theme,
    (value) => {
      apply(value)
      localStorage.setItem(STORAGE_KEY, value)
    },
    { immediate: true, flush: 'sync' },
  )

  return { theme, toggle, set }
})
