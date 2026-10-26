<script setup lang="ts">
import { Delete, Drag } from '@icon-park/vue-next'
import { storeToRefs } from 'pinia'
import type { DropResult } from 'smooth-dnd'
import { dropHandlers, smoothDnD } from 'smooth-dnd'
import { toRaw } from 'vue'

import { SmoothDndContainer } from '@/components/SmoothDnd/SmoothDndContainer'
import { SmoothDndDraggable } from '@/components/SmoothDnd/SmoothDndDraggable'
import { useAppEditorStore } from '@/stores/appEditor'
import { useEnvStore } from '@/stores/debug'
import { arrayMove } from '@/utils/array'

smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler

const envStore = useEnvStore()
const appEditorStore = useAppEditorStore()

const { currentBlockId, blocks } = storeToRefs(appEditorStore)
const { selectBlock, updateBlocks } = appEditorStore

const applyDrag = <T extends any[]>(arr: T, dragResult: DropResult) => {
  const { removedIndex, addedIndex, payload } = dragResult

  const result = [...arr]

  if (addedIndex === null) return result

  if (addedIndex !== null && removedIndex === null) {
    result.splice(addedIndex, 0, {
      id: `${Math.random()}`,
      ...payload
    })
  }

  if (addedIndex !== null && removedIndex !== null) {
    return arrayMove(result, removedIndex, addedIndex)
  }

  return result
}
</script>

<template>
  <SmoothDndContainer
    drag-handle-selector=".handle"
    group-name="blocks"
    orientation="vertical"
    tag="div"
    @drop="updateBlocks(applyDrag(toRaw(blocks), $event))"
  >
    <SmoothDndDraggable v-for="(block, i) in blocks" :key="block.id">
      <div class="block-wrapper" @click.stop="selectBlock(block.id)">
        <component :is="$blocksMap[block.type].material" class="block" />

        <div
          :class="[
            'block-wrapper-indicator',
            { shown: envStore.debug, selected: currentBlockId === block.id }
          ]"
        >
          <div v-if="currentBlockId === block.id" class="block-toolbar">
            <div class="block-toolbar-item handle">
              <Drag />
            </div>
            <div class="block-toolbar-item" @click="blocks.splice(i, 1)">
              <Delete />
            </div>
          </div>
        </div>
      </div>
    </SmoothDndDraggable>
  </SmoothDndContainer>
</template>

<style scoped>
.block-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  margin-top: 16px;
  padding: 6px 4px;
  border-radius: 8px;
  background-color: var(--color-white);
  transition: box-shadow 0.2s ease-in-out;
}

.block {
  position: relative;
  z-index: 1;
}

.block-wrapper-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 8px;
  pointer-events: none;
  user-select: none;
}

.block-wrapper-indicator.shown {
  border: 1px dashed var(--color-gray-300);
}

.block-wrapper-indicator.selected {
  border: 1px solid var(--color-primary);
}

.block-toolbar {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: -36px;
  z-index: 1;
  padding: 4px 8px;
  gap: 4px;
  background-color: var(--color-black);
  border-radius: 6px;
  pointer-events: auto;
}

.block-toolbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  color: var(--color-white);
  cursor: pointer;
}

.block-toolbar-item:nth-of-type(1) {
  cursor: grab;
}

.block-toolbar-item:hover {
  background-color: var(--color-gray-800);
  transition: all 0.2s ease-in-out;
}
</style>

<style>
.smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
</style>