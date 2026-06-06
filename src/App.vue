<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopBar from '@/components/layout/AppTopBar.vue'
import SlideOver from '@/components/layout/SlideOver.vue'
</script>

<template>
  <div class="app">
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
