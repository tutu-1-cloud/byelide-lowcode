<script setup lang="ts">
import AppPreviewer from '@/components/AppPreviewer/AppPreviewer.vue'
</script>

<template>
  <div class="layout-wrapper">
    <aside class="layout-left">
      <div class="placeholder">左侧物料面板</div>
    </aside>

    <AppPreviewer />

    <aside class="layout-right">
      <div class="placeholder">右侧配置面板</div>
    </aside>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
}

.layout-left {
  flex-shrink: 0;
  width: 320px;
  border-right: 1px solid var(--color-gray-300);
  background-color: var(--color-gray-100);
}

.layout-right {
  flex-shrink: 0;
  width: var(--panel-width);
  border-left: 1px solid var(--color-gray-300);
  background-color: var(--color-gray-100);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-gray-600);
  font-size: var(--font-size-normal);
}
</style>