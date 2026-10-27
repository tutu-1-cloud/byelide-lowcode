<script setup lang="ts">
import { Copy } from '@icon-park/vue-next'
import copyText from 'copy-text-to-clipboard'
import { computed, ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { JSONDataType } from 'vue-json-pretty/types/utils'

const props = defineProps<{
  data: JSONDataType
  title?: string
}>()

const copied = ref(false)
let timer: number | null = null

const jsonText = computed(() => JSON.stringify(props.data, null, 2))
const size = computed(() => `${jsonText.value.length} 字符`)

const handleCopy = () => {
  const ok = copyText(jsonText.value)
  if (!ok) return

  copied.value = true
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div class="schema-exporter">
    <div class="schema-header">
      <span class="schema-title">{{ props.title ?? 'Schema' }}</span>
      <span class="schema-size">{{ size }}</span>
      <button class="schema-copy" :class="{ copied }" @click="handleCopy">
        <Copy :size="14" />
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>

    <div class="schema-body tiny-scrollbar">
      <VueJsonPretty :data="props.data" show-icon show-line-number :deep="2" />
    </div>
  </div>
</template>

<style scoped>
.schema-exporter {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  background-color: var(--color-gray-100);
  overflow: hidden;
}

.schema-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--color-gray-300);
  font-size: var(--font-size-small);
  color: var(--color-gray-800);
}

.schema-title {
  font-weight: var(--font-weight-bold);
}

.schema-size {
  flex: 1;
  color: var(--color-gray-600);
}

.schema-copy {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background-color: var(--color-white);
  color: var(--color-gray-800);
  font-size: var(--font-size-small);
  cursor: pointer;
}

.schema-copy:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.schema-copy.copied {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.schema-body {
  max-height: 260px;
  overflow: auto;
  padding: 8px 4px;
  background-color: var(--color-white);
  font-size: 12px;
}
</style>