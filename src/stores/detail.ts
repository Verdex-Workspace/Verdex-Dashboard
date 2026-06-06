import { defineStore } from 'pinia'
import { ref, shallowRef, type Component } from 'vue'

export interface DetailPanel {
  icon?: string
  title: string
  sub?: string
  /** Composant rendu dans le corps du panneau. */
  component: Component
  props?: Record<string, unknown>
}

/**
 * Panneau de détail glissant (slide-over) global.
 * Pattern central du design (ex. clic sur une carte d'outil → détails).
 */
export const useDetailStore = defineStore('detail', () => {
  const isOpen = ref(false)
  const panel = shallowRef<DetailPanel | null>(null)

  function open(next: DetailPanel) {
    panel.value = next
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, panel, open, close }
})
