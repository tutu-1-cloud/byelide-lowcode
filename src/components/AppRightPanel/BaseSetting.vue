<script setup lang="ts">
import type { BlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: BlockInfo
}>()

const emit = defineEmits<{
  changeLabel: [label: string]
}>()
</script>

<template>
  <SettingField label="名称">
    <input
      class="setting-input"
      :value="props.blockInfo.label"
      @input="emit('changeLabel', ($event.target as HTMLInputElement).value)"
    />
  </SettingField>
</template>