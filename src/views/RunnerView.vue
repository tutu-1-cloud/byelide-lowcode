<script setup lang="ts">
import AppRunnerRenderer from '@/components/AppRunnerRenderer/AppRunnerRenderer.vue'
</script>

<template>
  <div class="runner-wrapper">
    <AppRunnerRenderer />
  </div>
</template>

<style scoped>
.runner-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  background-color: var(--color-gray-100);
}
</style>