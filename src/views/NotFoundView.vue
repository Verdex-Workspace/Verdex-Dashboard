<script setup lang="ts">
import { VButton } from '@/components/ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div
    class="sheet"
    style="display: grid; place-items: center; min-height: 60vh; text-align: center"
  >
    <div>
      <div class="mono" style="font-size: 48px; color: var(--accent)">404</div>
      <h1 style="font-size: 22px; margin: 12px 0 4px">Page introuvable</h1>
      <p class="desc" style="color: var(--muted); margin-bottom: 18px">
        Ce module n'existe pas (encore).
      </p>
      <VButton primary @click="router.push({ name: 'overview' })"
        >← Retour à la vue d'ensemble</VButton
      >
    </div>
  </div>
</template>
