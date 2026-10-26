<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { Component } from 'vue'

import { blocksBaseMeta } from '@/constants/blocksBaseMeta'
import { useAppEditorStore } from '@/stores/appEditor'

import QuoteSetting from './QuoteSetting.vue'

const store = useAppEditorStore()
const { selectedBlock } = storeToRefs(store)

const settingPanel = computed<Component | null>(() => {
  if (!selectedBlock.value) return null

  switch (selectedBlock.value.type) {
    case 'quote':
      return QuoteSetting
    default:
      return null
  }
})

const handleChange = (patch: Record<string, unknown>) => {
  if (!selectedBlock.value) return
  store.updateBlockProps(selectedBlock.value.id, patch)
}
</script>

<template>
  <div class="app-right-panel-wrapper">
    <template v-if="selectedBlock">
      <div class="app-right-panel-header">
        {{ blocksBaseMeta[selectedBlock.type].label }}
      </div>

      <div class="app-right-panel-content">
        <component :is="settingPanel" :block-info="selectedBlock" @change="handleChange" />

        <p v-if="!settingPanel" class="hint">
          「{{ blocksBaseMeta[selectedBlock.type].label }}」的配置面板还没做
        </p>
      </div>
    </template>

    <div v-else class="empty-panel">选中一个块开始配置</div>
  </div>
</template>

<style scoped>
.app-right-panel-wrapper {
  position: relative;
  z-index: 4;
  flex-shrink: 0;
  width: var(--panel-width);
  height: 100%;
  background-color: var(--color-white);
  box-shadow: var(--color-gray-300) 1px 0 0;
}

.app-right-panel-header {
  height: 44px;
  line-height: 44px;
  padding: 0 16px 0 20px;
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bolder);
}

.app-right-panel-content {
  padding: 0 16px 0 20px;
}

.hint {
  margin-top: 12px;
  font-size: var(--font-size-small);
  color: var(--color-gray-700);
}

.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: var(--font-size-small);
  color: var(--color-gray-600);
}
</style>