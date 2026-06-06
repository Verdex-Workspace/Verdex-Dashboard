import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '@/stores/ui'

describe('useUiStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('démarre sur le premier client', () => {
    const ui = useUiStore()
    expect(ui.activeClient.id).toBe('me')
    expect(ui.clients.length).toBeGreaterThan(1)
  })

  it('change de client actif', () => {
    const ui = useUiStore()
    const other = ui.clients[1]
    ui.selectClient(other)
    expect(ui.activeClient.id).toBe(other.id)
  })

  it('ouvre et ferme la sidebar', () => {
    const ui = useUiStore()
    expect(ui.sidebarOpen).toBe(false)
    ui.toggleSidebar()
    expect(ui.sidebarOpen).toBe(true)
    ui.closeSidebar()
    expect(ui.sidebarOpen).toBe(false)
  })
})
