import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useDetailStore } from '@/stores/detail'

const Dummy = defineComponent({ template: '<div />' })

describe('useDetailStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('est fermé par défaut', () => {
    const detail = useDetailStore()
    expect(detail.isOpen).toBe(false)
    expect(detail.panel).toBeNull()
  })

  it('ouvre un panneau avec son contenu', () => {
    const detail = useDetailStore()
    detail.open({ title: 'Outil', component: Dummy })
    expect(detail.isOpen).toBe(true)
    expect(detail.panel?.title).toBe('Outil')
  })

  it('se ferme', () => {
    const detail = useDetailStore()
    detail.open({ title: 'Outil', component: Dummy })
    detail.close()
    expect(detail.isOpen).toBe(false)
  })
})
