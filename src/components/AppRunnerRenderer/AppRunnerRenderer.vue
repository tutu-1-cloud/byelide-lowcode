<script setup lang="ts">
import { provide } from 'vue'

import LaptopPreviewer from '../AppPreviewer/LaptopPreviewer.vue'

provide('editable', false)
</script>

<template>
  <div class="runner-renderer">
    <LaptopPreviewer />
  </div>
</template>

<style scoped>
.runner-renderer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
</style>
