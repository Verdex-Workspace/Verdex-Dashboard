import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import SettingsPanel from '@/views/settings/SettingsPanel.vue'

afterEach(() => {
  i18n.global.locale.value = 'fr'
})

function mountPanel() {
  setActivePinia(createPinia())
  return mount(SettingsPanel, { global: { plugins: [i18n] } })
}

describe('SettingsPanel', () => {
  it('affiche compte, apparence, langue et sécurité', () => {
    const wrapper = mountPanel()
    const text = wrapper.text()
    expect(text).toContain('Compte')
    expect(text).toContain('Apparence')
    expect(text).toContain('Langue')
    expect(text).toContain('Sécurité')
  })

  it('masque le formulaire de mot de passe en mode démo', () => {
    const wrapper = mountPanel()
    expect(wrapper.find('input[type="password"]').exists()).toBe(false)
  })
})
