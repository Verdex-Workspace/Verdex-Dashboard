import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProjectsView from '@/views/ProjectsView.vue'
import { useDetailStore } from '@/stores/detail'

/** Attend la résolution du service mock (setTimeout) puis le re-render. */
async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}

function mountView() {
  setActivePinia(createPinia())
  return mount(ProjectsView)
}

describe('ProjectsView', () => {
  it("affiche les cartes d'outils", async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('novaweb-api')
    expect(wrapper.text()).toContain('verdex-dashboard')
  })

  it('filtre les outils via la recherche', async () => {
    const wrapper = mountView()
    await settle()
    await wrapper.find('input[type="search"]').setValue('auth')
    expect(wrapper.text()).toContain('auth-gateway')
    expect(wrapper.text()).not.toContain('novaweb-api')
  })

  it('ouvre le panneau de détail au clic sur une carte', async () => {
    const wrapper = mountView()
    await settle()
    const detail = useDetailStore()
    expect(detail.isOpen).toBe(false)
    await wrapper.find('.wbox.clickable').trigger('click')
    expect(detail.isOpen).toBe(true)
    expect(detail.panel?.title).toBeTruthy()
  })
})
