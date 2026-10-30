<script setup lang="ts">
import type { NotesBlockInfo } from '@/types/block'

defineProps<{ blockInfo: NotesBlockInfo }>()
</script>

<template>
  <div class="notes">
    <p v-if="blockInfo.props.content" class="notes-content">
      {{ blockInfo.props.content }}
    </p>
    <p v-else class="notes-placeholder">点击添加笔记内容...</p>
  </div>
</template>

<style scoped>
.notes {
  width: 100%;
  min-height: 60px;
  padding: 16px;
  border: 1px dashed var(--color-gray-400);
  border-radius: 8px;
  background-color: var(--color-gray-50);
}

.notes-content {
  margin: 0;
  color: var(--color-gray-900);
  font-size: var(--font-size-normal);
  white-space: pre-wrap;
}

.notes-placeholder {
  margin: 0;
  color: var(--color-gray-500);
  font-size: var(--font-size-normal);
}
</style>
