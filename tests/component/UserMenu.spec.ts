import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { router } from '@/router'
import { i18n } from '@/i18n'
import UserMenu from '@/components/layout/UserMenu.vue'

afterEach(() => {
  i18n.global.locale.value = 'fr'
})

function mountMenu() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(UserMenu, { global: { plugins: [pinia, router, i18n] } })
}

describe('UserMenu', () => {
  it("affiche l'utilisateur et ouvre le menu au clic", async () => {
    const wrapper = mountMenu()
    expect(wrapper.text()).toContain('Mode démo')
    expect(wrapper.text()).not.toContain('Paramètres')
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Paramètres')
    expect(wrapper.text()).toContain('Langue')
  })

  it('bascule la langue FR → EN', async () => {
    const wrapper = mountMenu()
    await wrapper.find('button').trigger('click')
    const localeBtn = wrapper.findAll('button').find((b) => b.text() === 'FR')!
    await localeBtn.trigger('click')
    expect(i18n.global.locale.value).toBe('en')
    expect(wrapper.text()).toContain('Settings')
  })

  it('masque la déconnexion en mode démo', async () => {
    const wrapper = mountMenu()
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).not.toContain('Se déconnecter')
  })
})
