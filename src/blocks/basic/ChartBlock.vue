<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import type { ChartBlockInfo } from '@/types/block'

defineProps<{ blockInfo: ChartBlockInfo }>()

// 只有真正渲染到图表块时，才去下载这个 chunk（里面才有 echarts）
const ChartRenderer = defineAsyncComponent(() => import('./ChartRenderer.vue'))
</script>

<template>
  <div class="chart-block">
    <ChartRenderer :block-info="blockInfo" />
  </div>
</template>

<style scoped>
.chart-block {
  width: 100%;
  height: 320px;
  padding: 8px;
  box-sizing: border-box;
}
</style>