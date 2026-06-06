import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TicketingView from '@/views/TicketingView.vue'
import { useDetailStore } from '@/stores/detail'

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  await flushPromises()
}

function mountView() {
  setActivePinia(createPinia())
  return mount(TicketingView)
}

describe('TicketingView', () => {
  it('affiche le Kanban avec des tickets', async () => {
    const wrapper = mountView()
    await settle()
    expect(wrapper.text()).toContain('Backlog')
    expect(wrapper.text()).toContain('Fuite mémoire sur le worker de rapports')
  })

  it('bascule vers la vue Table', async () => {
    const wrapper = mountView()
    await settle()
    const tableTab = wrapper.findAll('.tabsw button').find((b) => b.text() === 'Table')!
    await tableTab.trigger('click')
    expect(wrapper.text()).toContain('ÉCHÉANCE')
  })

  it('filtre par priorité', async () => {
    const wrapper = mountView()
    await settle()
    const prioritySelect = wrapper.findAll('select')[2]
    await prioritySelect.setValue('P1')
    expect(wrapper.text()).toContain('Port PostgreSQL 5432 exposé publiquement')
    expect(wrapper.text()).not.toContain('Mode sombre du front Atelier')
  })

  it('crée un ticket et ouvre son détail', async () => {
    const wrapper = mountView()
    await settle()
    const detail = useDetailStore()
    const addBtn = wrapper.findAll('button').find((b) => b.text().includes('+ ticket'))!
    await addBtn.trigger('click')
    expect(detail.isOpen).toBe(true)
    expect(wrapper.text()).toContain('Nouveau ticket')
  })
})
