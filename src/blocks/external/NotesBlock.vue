<script setup lang="ts">
import type { NotesBlockInfo } from '@/types/block'

defineProps<{ blockInfo: NotesBlockInfo }>()
</script>

<template>
  <div class="notes">Notes Block（富文本编辑器待接入）</div>
</template>

<style scoped>
.notes {
  padding: 16px;
  border: 1px dashed var(--color-gray-400);
  border-radius: 8px;
  color: var(--color-gray-600);
}
</style>