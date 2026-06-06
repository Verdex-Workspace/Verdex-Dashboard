import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AutomationsView from '@/views/AutomationsView.vue'

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}

function mountView() {
  setActivePinia(createPinia())
  return mount(AutomationsView)
}

describe('AutomationsView', () => {
  it('affiche le premier workflow et son graphe', async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('Sync CRM → Sheets')
    expect(wrapper.findAll('line').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain("Logs d'exécution")
  })

  it('change de workflow sélectionné', async () => {
    const wrapper = mountView()
    await settle()
    const items = wrapper.findAll('.wbox.clickable')
    const target = items.find((b) => b.text().includes('Onboarding client'))!
    await target.trigger('click')
    expect(wrapper.text()).toContain('crée dossier')
  })

  it('lance une exécution', async () => {
    const wrapper = mountView()
    await settle()
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('exécuter'))!
    await runBtn.trigger('click')
    expect(wrapper.text()).toContain('exécution en cours')
  })
})
