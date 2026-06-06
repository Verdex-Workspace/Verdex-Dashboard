import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LogsView from '@/views/LogsView.vue'

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}

function mountView() {
  setActivePinia(createPinia())
  return mount(LogsView)
}

describe('LogsView', () => {
  it('affiche le flux de logs et les connecteurs', async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('Flux de logs')
    expect(wrapper.text()).toContain('Prometheus')
    expect(wrapper.text()).toContain('502 upstream')
  })

  it('filtre le flux par requête', async () => {
    const wrapper = mountView()
    await settle()
    await wrapper.find('input[type="search"]').setValue('disk')
    expect(wrapper.text()).toContain('disk /var 81%')
    expect(wrapper.text()).not.toContain('502 upstream')
  })

  it('passe en vue par source au clic sur un connecteur', async () => {
    const wrapper = mountView()
    await settle()
    const chips = wrapper.findAll('.chip').filter((c) => c.text() === 'Docker')
    await chips[0].trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('container billing restarted')
    expect(wrapper.text()).not.toContain('502 upstream')
  })
})
