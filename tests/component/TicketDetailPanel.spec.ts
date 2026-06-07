import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TicketDetailPanel from '@/views/ticketing/TicketDetailPanel.vue'
import { TICKETS, ASSIGNEES } from '@/data/mock/ticketing'

function mountPanel(onUpdate = vi.fn()) {
  setActivePinia(createPinia())
  const wrapper = mount(TicketDetailPanel, {
    props: { ticket: { ...TICKETS[0] }, assignees: ASSIGNEES, onUpdate },
  })
  return { wrapper, onUpdate }
}

describe('TicketDetailPanel — édition inline', () => {
  it('change le statut et propage le ticket mis à jour', async () => {
    const { wrapper, onUpdate } = mountPanel()
    const statusSelect = wrapper.findAll('select')[0]
    await statusSelect.setValue('done')
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate.mock.calls[0][0]).toMatchObject({ id: TICKETS[0].id, status: 'done' })
  })

  it('bascule un label et propage la nouvelle liste', async () => {
    const { wrapper, onUpdate } = mountPanel()
    // Les chips de labels sont des boutons cliquables (sélection guidée).
    const labelButton = wrapper.findAll('button').find((b) => b.text() === 'frontend')!
    await labelButton.trigger('click')
    expect(onUpdate).toHaveBeenCalled()
    const updated = onUpdate.mock.calls.at(-1)![0]
    expect(updated.labels.some((l: { name: string }) => l.name === 'frontend')).toBe(true)
  })
})
