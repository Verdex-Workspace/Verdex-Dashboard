import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProtonView from '@/views/ProtonView.vue'

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}
function mountView() {
  setActivePinia(createPinia())
  return mount(ProtonView)
}

describe('ProtonView', () => {
  it('affiche les 6 widgets Proton', async () => {
    const wrapper = mountView()
    await settle()
    const text = wrapper.text()
    expect(text).toContain('Proton Mail')
    expect(text).toContain('Proton Calendar')
    expect(text).toContain('Proton Pass')
    expect(text).toContain('Proton Authenticator')
    expect(text).toContain('Proton Drive')
    expect(text).toContain('Docs & Sheets')
  })

  it('affiche les remontées (mail, événements, codes)', async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('Facture OVH')
    expect(wrapper.text()).toContain('Audit NovaWeb')
    expect(wrapper.text()).toContain('482 193')
  })
})
