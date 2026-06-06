<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopBar from '@/components/layout/AppTopBar.vue'
import SlideOver from '@/components/layout/SlideOver.vue'

const route = useRoute()
</script>

<template>
  <!-- Layout vierge (ex. page de connexion) -->
  <RouterView v-if="route.meta.blank" />

  <!-- Layout applicatif (shell) -->
  <div v-else class="app">
    <AppSidebar />
    <div class="main">
      <AppTopBar />
      <main class="canvas">
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </main>
    </div>
    <SlideOver />
  </div>
</template>
