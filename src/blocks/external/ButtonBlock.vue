<script setup lang="ts">
import type { ButtonBlockInfo } from '@/types/block'

defineProps<{ blockInfo: ButtonBlockInfo }>()
</script>

<template>
  <div class="button">{{ blockInfo.props.content }}</div>
</template>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  background-color: var(--color-primary);
}
</style>