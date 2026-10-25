<script setup lang="ts">
import type { DropResult } from 'smooth-dnd'
import { ref, toRaw } from 'vue'

import { arrayMove } from '@/utils/array'

import { SmoothDndContainer } from '../SmoothDnd/SmoothDndContainer'
import { SmoothDndDraggable } from '../SmoothDnd/SmoothDndDraggable'

const items = ref(
  Array.from({ length: 8 }, (_, i) => ({
    id: `item-${i + 1}`,
    label: `物料 ${i + 1}`
  }))
)

const onDrop = (dropResult: DropResult) => {
  const { removedIndex, addedIndex } = dropResult

  if (removedIndex === null || addedIndex === null) return

  items.value = arrayMove(toRaw(items.value), removedIndex, addedIndex)
}
</script>

<template>
  <div class="left-panel-wrapper">
    <SmoothDndContainer
      class="dnd-container"
      group-name="demo"
      orientation="vertical"
      tag="div"
      @drop="onDrop"
    >
      <SmoothDndDraggable v-for="item in items" :key="item.id">
        <div class="dnd-item">{{ item.label }}</div>
      </SmoothDndDraggable>
    </SmoothDndContainer>
  </div>
</template>

<style scoped>
.left-panel-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  box-sizing: border-box;
}

.dnd-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dnd-item {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background-color: var(--color-white);
  cursor: grab;
  user-select: none;
}

.dnd-item:active {
  cursor: grabbing;
}
</style>