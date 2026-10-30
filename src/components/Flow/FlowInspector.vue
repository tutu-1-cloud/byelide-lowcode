<script setup lang="ts">
import { computed } from 'vue'
import type { Node } from '@vue-flow/core'

import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  node: Node | null
}>()

const emit = defineEmits<{
  updateData: [id: string, patch: Record<string, unknown>]
  deleteNode: [id: string]
}>()

const nodeTypeLabel = computed(() => {
  if (!props.node) return ''
  const map: Record<string, string> = {
    input: '输入节点',
    output: '输出节点',
    default: '普通节点',
  }
  return map[props.node.type ?? 'default'] ?? props.node.type ?? '普通节点'
})

// 各类型节点的专属配置字段
const typeFields = computed(() => {
  if (!props.node) return []
  const type = props.node.type ?? 'default'
  const fieldMap: Record<string, { key: string; label: string; placeholder: string }[]> = {
    input: [{ key: 'source', label: '数据来源', placeholder: '如 /api/data' }],
    default: [{ key: 'action', label: '处理动作', placeholder: '如 transform / filter' }],
    output: [{ key: 'target', label: '输出目标', placeholder: '如 database / console' }],
  }
  return fieldMap[type] ?? []
})

function updateField(key: string, value: string) {
  if (!props.node) return
  emit('updateData', props.node.id, { [key]: value })
}
</script>

<template>
  <div class="flow-inspector">
    <div class="inspector-header">节点配置</div>

    <div v-if="node" class="inspector-content tiny-scrollbar">
      <div class="setting-section">
        <div class="setting-section-title">基础</div>
        <SettingField label="名称">
          <input
            class="setting-input"
            :value="(node.data?.label as string) ?? ''"
            @input="updateField('label', ($event.target as HTMLInputElement).value)"
          />
        </SettingField>
        <SettingField label="类型">
          <div class="node-type-tag">{{ nodeTypeLabel }}</div>
        </SettingField>
      </div>

      <div v-if="typeFields.length" class="setting-section">
        <div class="setting-section-title">专属配置</div>
        <SettingField v-for="field in typeFields" :key="field.key" :label="field.label">
          <input
            class="setting-input"
            :value="(node.data?.[field.key] as string) ?? ''"
            :placeholder="field.placeholder"
            @input="updateField(field.key, ($event.target as HTMLInputElement).value)"
          />
        </SettingField>
      </div>

      <button class="delete-btn" @click="emit('deleteNode', node.id)">删除节点</button>
    </div>

    <p v-else class="empty-tip">选中一个节点开始配置</p>
  </div>
</template>

<style scoped>
.flow-inspector {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-white);
}

.inspector-header {
  height: 44px;
  line-height: 44px;
  padding: 0 16px;
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bolder);
  border-bottom: 1px solid var(--color-gray-200);
}

.inspector-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.setting-section {
  margin-bottom: 20px;
}

.setting-section-title {
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-gray-200);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-700);
}

.node-type-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  background-color: var(--color-blue-100);
  color: var(--color-blue-700);
  font-size: var(--font-size-small);
}

.delete-btn {
  width: 100%;
  padding: 8px;
  border: 1px solid #f56c6c;
  border-radius: 6px;
  background-color: #fef0f0;
  color: #f56c6c;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: #f56c6c;
  color: var(--color-white);
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-gray-600);
  font-size: var(--font-size-small);
}
</style>
