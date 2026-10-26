<script setup lang="ts">
import type { QuoteBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: QuoteBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Record<string, unknown>]
}>()

const statusOptions = [
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
  { value: 'error', label: '错误' }
] as const
</script>

<template>
  <div class="setting-item">
    <label class="setting-label">内容</label>
    <input
      class="setting-input"
      :value="props.blockInfo.props.content"
      @input="emit('change', { content: ($event.target as HTMLInputElement).value })"
    />
  </div>

  <div class="setting-item">
    <label class="setting-label">状态</label>
    <select
      class="setting-input"
      :value="props.blockInfo.props.status"
      @change="emit('change', { status: ($event.target as HTMLSelectElement).value })"
    >
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.setting-item {
  margin-bottom: 12px;
}

.setting-label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--font-size-small);
  color: var(--color-gray-800);
}

.setting-input {
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  outline-style: none;
  color: var(--color-gray-800);
  box-sizing: border-box;
}
</style>