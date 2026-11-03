<script setup lang="ts">
import LaptopPreviewer from './LaptopPreviewer.vue'
</script>

<template>
  <div class="layout-content">
    <LaptopPreviewer />
  </div>
</template>

<style scoped>
.layout-content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  flex: 1;
  background-color: var(--color-gray-100);
}
</style>
