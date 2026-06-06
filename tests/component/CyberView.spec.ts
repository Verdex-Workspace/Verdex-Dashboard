import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CyberView from '@/views/CyberView.vue'
import { useDetailStore } from '@/stores/detail'

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}

function mountView() {
  setActivePinia(createPinia())
  return mount(CyberView)
}

function stepButton(wrapper: ReturnType<typeof mount>, name: string) {
  return wrapper.findAll('button').find((b) => b.text().includes(name))!
}

describe('CyberView', () => {
  it("démarre sur l'étape Sources", async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('Déposez vos documents')
    expect(wrapper.text()).toContain('accès SSH (clés)')
  })

  it('affiche le rapport et ses vulnérabilités', async () => {
    const wrapper = mountView()
    await settle()
    await stepButton(wrapper, 'Rapport').trigger('click')
    expect(wrapper.text()).toContain('Score sécurité')
    expect(wrapper.text()).toContain('Port PostgreSQL 5432 exposé publiquement')
  })

  it("ouvre le détail d'une vulnérabilité", async () => {
    const wrapper = mountView()
    await settle()
    await stepButton(wrapper, 'Rapport').trigger('click')
    const detail = useDetailStore()
    await wrapper.find('.wbox.clickable').trigger('click')
    expect(detail.isOpen).toBe(true)
    expect(detail.panel?.sub).toContain('CVSS')
  })
})
