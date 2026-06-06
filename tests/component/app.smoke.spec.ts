import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/router'

describe('App (smoke)', () => {
  it("monte le shell et la vue d'ensemble sans erreur", async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [createPinia(), router] },
    })
    await flushPromises()

    // Shell présent
    expect(wrapper.find('.side').exists()).toBe(true)
    expect(wrapper.find('.top').exists()).toBe(true)
    expect(wrapper.text()).toContain('Verdex')

    // La vue d'ensemble s'est chargée (données mock résolues)
    expect(wrapper.find('.sheet').exists()).toBe(true)
  })

  it('navigue vers un autre module', async () => {
    await router.push('/projects')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [createPinia(), router] },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Projets & Outils')
  })
})
