<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'

import type { ChartBlockInfo } from '@/types/block'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const props = defineProps<{
  blockInfo: ChartBlockInfo
}>()

const option = computed<EChartsOption>(() => {
  const { chartKind, data } = props.blockInfo.props
  const labels = data.map((d) => d.label)
  const values = data.map((d) => d.value)

  if (chartKind === 'pie') {
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
          data: data.map((d) => ({ name: d.label, value: d.value }))
        }
      ]
    }
  }

  const axis = {
    tooltip: { trigger: 'axis' as const },
    legend: { top: 0 },
    grid: { left: 48, right: 24, top: 40, bottom: 32 },
    xAxis: { type: 'category' as const, data: labels },
    yAxis: { type: 'value' as const }
  }

  if (chartKind === 'bar') {
    return {
      ...axis,
      series: [{ type: 'bar', data: values, barMaxWidth: 32, itemStyle: { borderRadius: [4, 4, 0, 0] } }]
    }
  }

  return {
    ...axis,
    series: [{ type: 'line', data: values, smooth: true, areaStyle: { opacity: 0.12 } }]
  }
})
</script>

<template>
  <div class="chart-block">
    <VChart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped>
.chart-block {
  width: 100%;
  height: 320px;
  padding: 8px;
  box-sizing: border-box;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>