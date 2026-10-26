<script setup lang="ts">
import type { HeroTitleBlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: HeroTitleBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<HeroTitleBlockInfo['props']>]
}>()
</script>

<template>
  <SettingField label="标题内容">
    <input
      class="setting-input"
      :value="props.blockInfo.props.content"
      @input="emit('change', { content: ($event.target as HTMLInputElement).value })"
    />
  </SettingField>
</template>