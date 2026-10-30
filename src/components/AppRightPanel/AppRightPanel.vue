<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, toRaw } from 'vue'
import type { Component } from 'vue'

import { blocksBaseMeta } from '@/constants/blocksBaseMeta'
import { useAppEditorStore } from '@/stores/appEditor'
import type { BlockType } from '@/types/block'

import BaseSetting from './BaseSetting.vue'
import ButtonSetting from './ButtonSetting.vue'
import ChartSetting from './ChartSetting.vue'
import FormSetting from './FormSetting.vue'
import HeroTitleSetting from './HeroTitleSetting.vue'
import ImageSetting from './ImageSetting.vue'
import NotesSetting from './NotesSetting.vue'
import QuoteSetting from './QuoteSetting.vue'
import SchemaExporter from './SchemaExporter.vue'

const store = useAppEditorStore()
const { selectedBlock } = storeToRefs(store)

const settingMap: Partial<Record<BlockType, Component>> = {
  quote: QuoteSetting,
  image: ImageSetting,
  heroTitle: HeroTitleSetting,
  button: ButtonSetting,
  notes: NotesSetting,
  chart: ChartSetting,
  form: FormSetting
}

const settingPanel = computed(() => {
  if (!selectedBlock.value) return null
  return settingMap[selectedBlock.value.type as BlockType] ?? null
})

const blockSchema = computed<Record<string, unknown> | null>(() => {
  const block = selectedBlock.value
  if (!block) return null
  return JSON.parse(JSON.stringify(toRaw(block)))
})

const handlePropsChange = (patch: object) => {
  if (!selectedBlock.value) return
  store.updateBlockProps(selectedBlock.value.id, patch)
}

const handleLabelChange = (label: string) => {
  if (!selectedBlock.value) return
  store.updateBlockLabel(selectedBlock.value.id, label)
}
</script>

<template>
  <div class="app-right-panel-wrapper">
    <div v-if="selectedBlock" class="app-right-panel-header">
      {{ blocksBaseMeta[selectedBlock.type].label }}
    </div>

    <div class="app-right-panel-content tiny-scrollbar">
      <template v-if="selectedBlock">
        <div class="setting-section">
          <div class="setting-section-title">基础</div>
          <BaseSetting :block-info="selectedBlock" @change-label="handleLabelChange" />
        </div>

        <div class="setting-section">
          <div class="setting-section-title">专属</div>
          <component
            :is="settingPanel"
            v-if="settingPanel"
            :block-info="selectedBlock"
            @change="handlePropsChange"
          />
          <p v-else class="hint">
            「{{ blocksBaseMeta[selectedBlock.type].label }}」的专属配置待补充
          </p>
        </div>

        <div class="setting-section">
          <div class="setting-section-title">出码</div>
          <SchemaExporter
            v-if="blockSchema"
            :data="blockSchema"
            :title="`当前块 · ${selectedBlock.type}`"
          />
        </div>
      </template>

      <p v-else class="empty-tip">选中一个块开始配置</p>
    </div>
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
  overflow-y: auto;
  height: calc(100% - 44px);
  box-sizing: border-box;
}

.setting-section {
  margin-bottom: 16px;
}

.setting-section-title {
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-gray-200);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-700);
}

.hint {
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

.empty-tip {
  padding: 24px 0;
  text-align: center;
  font-size: var(--font-size-small);
  color: var(--color-gray-600);
}
</style>