import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import en from './locales/en'

export type Locale = 'fr' | 'en'

const STORAGE_KEY = 'verdex:locale'

export function initialLocale(): Locale {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY)
    return stored === 'en' ? 'en' : 'fr'
  } catch {
    return 'fr'
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'fr',
  messages: { fr, en },
})

/** Change la langue active, la persiste et met à jour `<html lang>`. */
export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, locale)
  } catch {
    // localStorage indisponible (SSR/test) — on ignore.
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

// Applique la langue initiale au document.
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.global.locale.value
}
