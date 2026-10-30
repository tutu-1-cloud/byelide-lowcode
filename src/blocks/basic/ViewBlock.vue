<script setup lang="ts">
import type { ViewBlockInfo } from '@/types/block'

import CanvasTable from '@/views/DataSourceContent/CanvasTable.vue'

defineProps<{ blockInfo: ViewBlockInfo }>()
</script>

<template>
  <div class="view-block">
    <CanvasTable />
  </div>
</template>

<style scoped>
.view-block {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  background-color: var(--color-white);
  overflow: hidden;
}
</style>
