<script setup lang="ts">
import type { ImageBlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: ImageBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<ImageBlockInfo['props']>]
}>()
</script>

<template>
  <SettingField label="图片地址">
    <input
      class="setting-input"
      :value="props.blockInfo.props.url"
      @input="emit('change', { url: ($event.target as HTMLInputElement).value })"
    />
  </SettingField>
</template>