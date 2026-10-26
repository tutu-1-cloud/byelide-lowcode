<script setup lang="ts">
import type { ChartBlockInfo } from '@/types/block'

defineProps<{ blockInfo: ChartBlockInfo }>()
</script>

<template>
  <div class="chart-block">Chart Block</div>
</template>

<style scoped>
.chart-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  border-radius: 8px;
  background-color: var(--color-gray-100);
  color: var(--color-gray-600);
}
</style>