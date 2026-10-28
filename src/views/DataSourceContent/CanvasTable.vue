<template>
  <div class="container">
    <canvas ref="canvas" @mousedown="handleMouseDown"></canvas>
    <div ref="scrollContainer" class="scroll-container" @scroll="handleScroll">
      <div ref="spacer" :style="{ height: spacerHeight + 'px' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'

const canvas = ref(null)
const context = ref(null)
const scrollContainer = ref(null)

const data = reactive({
  columns: ['ID', 'Name', 'Age'],
  rows: Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    age: 20 + (i % 50)
  }))
})

const rowHeight = 30
const headerHeight = 30
const visibleRows = 11
const containerHeight = 330
const devicePixelRatio = window.devicePixelRatio || 1

// 计算总内容高度和spacer的高度
const totalContentHeight = data.rows.length * rowHeight + headerHeight
const spacerHeight = totalContentHeight > containerHeight ? totalContentHeight - containerHeight : 0

onMounted(() => {
  if (canvas.value) {
    adjustCanvasResolution()
    drawTable()
  }
})

watch(
  () => scrollContainer.value?.scrollTop,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      drawTable()
    }
  }
)

function adjustCanvasResolution() {
  const canvasWidth = 400
  canvas.value.width = canvasWidth * devicePixelRatio
  canvas.value.height = containerHeight * devicePixelRatio
  canvas.value.style.width = `${canvasWidth}px`
  canvas.value.style.height = `${containerHeight}px`
  context.value = canvas.value.getContext('2d')
  context.value.scale(devicePixelRatio, devicePixelRatio)
}

function handleScroll() {
  drawTable()
}

function drawTable() {
  if (!context.value) return

  const scrollTop = scrollContainer.value.scrollTop
  const startRow = Math.floor(scrollTop / rowHeight)
  const endRow = startRow + visibleRows

  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  context.value.fillStyle = '#000'

  // 绘制表头
  if (scrollTop < headerHeight) {
    context.value.fillText(data.columns.join('  '), 10, headerHeight - scrollTop)
  }

  // 绘制可视区域的行
  for (let i = startRow; i < endRow; i++) {
    if (i < data.rows.length) {
      const y = (i - startRow) * rowHeight + headerHeight - (scrollTop % rowHeight)
      const rowText = `${data.rows[i].id}  ${data.rows[i].name}  ${data.rows[i].age}`
      context.value.fillText(rowText, 10, y)
    }
  }
}

function handleMouseDown(event) {
  console.log('MouseDown event detected:', event)
}
</script>

<style scoped>
.container {
  position: relative;
  width: 420px;
}

.scroll-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 330px;
  overflow-y: auto;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>