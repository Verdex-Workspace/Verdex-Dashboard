import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminView from '@/views/AdminView.vue'

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}
function mountView() {
  setActivePinia(createPinia())
  return mount(AdminView)
}
function tab(wrapper: ReturnType<typeof mount>, label: string) {
  return wrapper.findAll('.tabsw button').find((b) => b.text() === label)!
}

describe('AdminView', () => {
  it("affiche la table des ports et l'alerte 5432", async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('5432')
    expect(wrapper.text()).toContain('exposé en public')
  })

  it('affiche les conteneurs Docker', async () => {
    const wrapper = mountView()
    await settle()
    await tab(wrapper, 'Docker').trigger('click')
    expect(wrapper.text()).toContain('traefik:v3')
    expect(wrapper.text()).toContain('docker-compose.yml')
  })

  it('affiche les scripts par projet', async () => {
    const wrapper = mountView()
    await settle()
    await tab(wrapper, 'Scripts').trigger('click')
    expect(wrapper.text()).toContain('verdex-dashboard')
    expect(wrapper.text()).toContain('pnpm run')
  })
})
