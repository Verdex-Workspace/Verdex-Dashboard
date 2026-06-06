import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/router'
import { i18n } from '@/i18n'

describe('App (smoke)', () => {
  it("monte le shell et la vue d'ensemble sans erreur", async () => {
    // Pinia actif avant la navigation : la garde du router utilise useAuthStore().
    const pinia = createPinia()
    setActivePinia(pinia)

    router.push('/')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [pinia, router, i18n] } })
    await flushPromises()

    // Shell présent (mode démo → pas de redirection vers /login)
    expect(wrapper.find('.side').exists()).toBe(true)
    expect(wrapper.find('.top').exists()).toBe(true)
    expect(wrapper.text()).toContain('Verdex')
    expect(wrapper.find('.sheet').exists()).toBe(true)
  })

  it('navigue vers un autre module', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    await router.push('/projects')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [pinia, router, i18n] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Projets & Outils')
  })
})
