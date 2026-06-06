import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('applique le thème au document', () => {
    const store = useThemeStore()
    expect(document.documentElement.dataset.theme).toBe(store.theme)
  })

  it('bascule entre sombre et clair', () => {
    const store = useThemeStore()
    const initial = store.theme
    store.toggle()
    expect(store.theme).not.toBe(initial)
    expect(document.documentElement.dataset.theme).toBe(store.theme)
  })

  it('persiste le thème choisi', () => {
    const store = useThemeStore()
    store.set('light')
    expect(localStorage.getItem('verdex:theme')).toBe('light')
  })
})
