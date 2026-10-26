<script setup lang="ts">
import { Error, Success, Wallet } from '@icon-park/vue-next'
import { computed } from 'vue'

import type { QuoteBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: QuoteBlockInfo
}>()

const STATUS_MAP = {
  success: { color: '#059669', bgColor: '#E4F2E9', icon: Success },
  warning: { color: '#E18F05', bgColor: '#F8ECEC', icon: Error },
  error: { color: '#DC2C26', bgColor: '#F8ECEC', icon: Wallet }
}

const style = computed(() => STATUS_MAP[props.blockInfo.props.status])
</script>

<template>
  <div
    class="quote"
    :style="{ backgroundColor: style.bgColor, color: style.color }"
  >
    <component :is="style.icon" />
    <span class="quote-text">{{ props.blockInfo.props.content }}</span>
  </div>
</template>

<style scoped>
.quote {
  display: flex;
  align-items: center;
  flex: 1;
  font-size: var(--font-size-large);
  padding: 8px 18px;
  border-radius: 8px;
}

.quote-text {
  margin-left: 6px;
}
</style>