<script setup lang="ts">
import type { NotesBlockInfo } from '@/types/block'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: NotesBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<NotesBlockInfo['props']>]
}>()
</script>

<template>
  <SettingField label="笔记内容">
    <textarea
      class="setting-textarea"
      :value="props.blockInfo.props.content"
      @input="emit('change', { content: ($event.target as HTMLTextAreaElement).value })"
    />
  </SettingField>
</template>