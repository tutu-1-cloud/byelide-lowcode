<script setup lang="ts">
import { createElement as reactCreateElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import ReactDataSource from './react_app/ReactDataSource'

const hostRef = ref<HTMLDivElement | null>(null)
let root: Root | null = null

onMounted(() => {
  if (!hostRef.value) return
  root = createRoot(hostRef.value)
  root.render(reactCreateElement(ReactDataSource))
})

onBeforeUnmount(() => {
  root?.unmount()
  root = null
})
</script>

<template>
  <div class="data-source-content-wrapper">
    <div class="data-source-render">
      <div ref="hostRef" class="react-host"></div>
    </div>
  </div>
</template>

<style scoped>
.data-source-content-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-gray-100);
}

.data-source-render {
  height: calc(100% - 40px);
  margin: 20px;
  padding: 12px;
  background-color: var(--color-white);
  border-radius: 8px;
  overflow: hidden;
}

.react-host {
  width: 100%;
  height: 100%;
}
</style>