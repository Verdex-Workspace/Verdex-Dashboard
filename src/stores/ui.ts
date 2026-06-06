import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client } from '@/types'
import { CLIENTS } from '@/data/navigation'

/** État d'interface global : client/espace actif et sidebar mobile. */
export const useUiStore = defineStore('ui', () => {
  const clients = ref<Client[]>(CLIENTS)
  const activeClient = ref<Client>(CLIENTS[0])
  const sidebarOpen = ref(false)

  function selectClient(client: Client) {
    activeClient.value = client
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  return { clients, activeClient, sidebarOpen, selectClient, toggleSidebar, closeSidebar }
})
