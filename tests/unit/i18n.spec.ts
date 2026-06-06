import { afterEach, describe, expect, it } from 'vitest'
import { i18n, initialLocale, setLocale } from '@/i18n'

afterEach(() => {
  i18n.global.locale.value = 'fr'
})

describe('i18n', () => {
  it('démarre en français par défaut', () => {
    expect(['fr', 'en']).toContain(initialLocale())
    expect(i18n.global.t('login.title')).toBe('Connexion')
  })

  it('bascule la langue, la persiste et met à jour <html lang>', () => {
    setLocale('en')
    expect(i18n.global.locale.value).toBe('en')
    expect(localStorage.getItem('verdex:locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(i18n.global.t('login.title')).toBe('Sign in')
  })
})
