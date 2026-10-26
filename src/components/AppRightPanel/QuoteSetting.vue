<script setup lang="ts">
import type { QuoteBlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: QuoteBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<QuoteBlockInfo['props']>]
}>()

const statusOptions = [
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
  { value: 'error', label: '错误' }
] as const

const onStatusChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as QuoteBlockInfo['props']['status']
  emit('change', { status: value })
}
</script>

<template>
  <SettingField label="内容">
    <input
      class="setting-input"
      :value="props.blockInfo.props.content"
      @input="emit('change', { content: ($event.target as HTMLInputElement).value })"
    />
  </SettingField>

  <SettingField label="状态">
    <select class="setting-input" :value="props.blockInfo.props.status" @change="onStatusChange">
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </SettingField>
</template>