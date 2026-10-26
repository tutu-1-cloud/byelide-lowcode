<script setup lang="ts">
import type { ButtonBlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: ButtonBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<ButtonBlockInfo['props']>]
}>()
</script>

<template>
  <SettingField label="按钮文字">
    <input
      class="setting-input"
      :value="props.blockInfo.props.content"
      @input="emit('change', { content: ($event.target as HTMLInputElement).value })"
    />
  </SettingField>
</template>