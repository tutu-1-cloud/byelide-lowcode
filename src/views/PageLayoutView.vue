<script setup lang="ts">
import AppLeftPanel from '@/components/AppLeftPanel/AppLeftPanel.vue'
import AppPreviewer from '@/components/AppPreviewer/AppPreviewer.vue'
import AppRightPanel from '@/components/AppRightPanel/AppRightPanel.vue'
</script>

<template>
  <div class="layout-wrapper">
    <AppLeftPanel />
    <AppPreviewer />
    <AppRightPanel />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
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