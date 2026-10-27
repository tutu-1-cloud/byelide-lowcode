<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components'
import { graphic, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ref } from 'vue'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent
])

const option = ref({
  color: ['#80FFA5', '#00DDFF'],
  title: { text: '渐变堆叠面积图' },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  legend: { data: ['Line 1', 'Line 2'] },
  toolbox: { feature: { saveAsImage: {} } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [{ type: 'value' }],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: { width: 0 },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgb(128, 255, 165)' },
          { offset: 1, color: 'rgb(1, 191, 236)' }
        ])
      },
      emphasis: { focus: 'series' },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: { width: 0 },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgb(0, 221, 255)' },
          { offset: 1, color: 'rgb(77, 119, 255)' }
        ])
      },
      emphasis: { focus: 'series' },
      data: [120, 282, 111, 234, 220, 340, 310]
    }
  ]
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>