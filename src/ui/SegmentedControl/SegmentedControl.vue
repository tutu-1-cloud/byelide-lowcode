<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { nextTick, onMounted, ref, useId, watch } from 'vue'

import type { SegmentedControlProps } from './types'

const props = defineProps<SegmentedControlProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const groupName = `segmented-${useId()}`

const itemRefs = ref<Record<string, HTMLElement | null>>({})
const indicator = ref({ width: 0, x: 0 })

const setItemRef = (value: string) => {
  return (el: Element | ComponentPublicInstance | null) => {
    itemRefs.value[value] = el as HTMLElement | null
  }
}

const updateIndicator = () => {
  const el = itemRefs.value[props.modelValue]
  if (!el) return
  indicator.value = { width: el.offsetWidth, x: el.offsetLeft }
}

const select = (value: string) => {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
}

watch(() => props.modelValue, () => nextTick(updateIndicator))
watch(() => props.data.length, () => nextTick(updateIndicator))

onMounted(() => nextTick(updateIndicator))
</script>

<template>
  <div class="segmented-control">
    <span
      class="segmented-indicator"
      :style="{
        width: `${indicator.width}px`,
        transform: `translateX(${indicator.x}px)`
      }"
    />

    <label
      v-for="item in props.data"
      :key="item.value"
      :ref="setItemRef(item.value)"
      class="segmented-item"
      :class="{ active: item.value === props.modelValue }"
    >
      <input
        class="segmented-input"
        type="radio"
        :name="groupName"
        :value="item.value"
        :checked="item.value === props.modelValue"
        @change="select(item.value)"
      />
      <span class="segmented-label">{{ item.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.segmented-control {
  position: relative;
  display: flex;
  width: 100%;
  height: 32px;
  padding: 2px;
  border-radius: 8px;
  background-color: var(--color-gray-100);
  box-sizing: border-box;
}

.segmented-indicator {
  position: absolute;
  top: 2px;
  left: 2px;
  height: 28px;
  border-radius: 6px;
  background-color: var(--color-white);
  box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
  transition:
    transform 0.2s ease-in-out,
    width 0.2s ease-in-out;
}

.segmented-item {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.segmented-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.segmented-label {
  font-size: var(--font-size-small);
  color: var(--color-gray-800);
}

.segmented-item.active .segmented-label {
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}
</style>