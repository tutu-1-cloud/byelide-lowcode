<script setup lang="ts">
import type { ViewBlockInfo } from '@/types/block'

defineProps<{ blockInfo: ViewBlockInfo }>()
</script>

<template>
  <div class="view-block">View Block</div>
</template>

<style scoped>
.view-block {
  padding: 40px;
  border: 1px dashed var(--color-gray-400);
  border-radius: 8px;
  text-align: center;
  color: var(--color-gray-600);
}
</style>