<script setup lang="ts">
import type { FormBlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: FormBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<FormBlockInfo['props']>]
}>()
</script>

<template>
  <SettingField label="提交按钮文案">
    <input
      class="setting-input"
      :value="props.blockInfo.props.submitText"
      @input="emit('change', { submitText: ($event.target as HTMLInputElement).value })"
    />
  </SettingField>

  <SettingField label="字段（只读）">
    <ul class="field-list">
      <li v-for="field in props.blockInfo.props.fields" :key="field.name" class="field-item">
        <span class="field-name">{{ field.name }}</span>
        <span class="field-type">{{ field.type }}</span>
        <span v-if="field.required" class="field-required">必填</span>
      </li>
    </ul>
  </SettingField>
</template>

<style scoped>
.field-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: var(--color-gray-100);
  font-size: var(--font-size-small);
}

.field-name {
  flex: 1;
  color: var(--color-gray-900);
}

.field-type {
  color: var(--color-gray-600);
}

.field-required {
  color: #dc2c26;
}

.field-hint {
  margin: 0;
  font-size: var(--font-size-small);
  color: var(--color-gray-600);
}
</style>