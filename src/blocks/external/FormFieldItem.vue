<!-- 表单字段项 -->
<!-- 定义规则 -->
<!-- 接受field{} -->
<!-- 渲染 -->
<!-- v-model="value"，自动绑定value -->
<script setup lang="ts">
import { defineRule, useField } from 'vee-validate'
import { computed } from 'vue'

import type { FormFieldSchema } from '@/types/block'

defineRule('required', (value: unknown) => {
  if (value === '' || value === undefined || value === null || value === false) {
    return '此项必填'
  }
  return true
})

defineRule('numeric', (value: unknown) => {
  if (value === '' || value === undefined) return true
  return Number.isNaN(Number(value)) ? '请输入数字' : true
})

const props = defineProps<{
  field: FormFieldSchema
}>()

const rules = computed(() => ({
  required: props.field.required ?? false,
  numeric: props.field.type === 'number'
}))

const { value, errorMessage } = useField<string | boolean | number>(
  () => props.field.name,
  rules
)
</script>

<template>
  <div class="form-row">
    <label class="form-label">
      {{ props.field.label }}
      <span v-if="props.field.required" class="form-required">*</span>
    </label>

    <input
      v-if="props.field.type === 'text'"
      v-model="value"
      class="form-control"
      :placeholder="props.field.placeholder"
    />

    <input
      v-else-if="props.field.type === 'number'"
      v-model="value"
      class="form-control"
      type="number"
      :placeholder="props.field.placeholder"
    />

    <select v-else-if="props.field.type === 'select'" v-model="value" class="form-control">
      <option value="">请选择</option>
      <option v-for="opt in props.field.options ?? []" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <input
      v-else-if="props.field.type === 'switch'"
      v-model="value"
      class="form-switch"
      type="checkbox"
    />

    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: var(--font-size-small);
  color: var(--color-gray-800);
}

.form-required {
  margin-left: 2px;
  color: #dc2c26;
}

.form-control {
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  outline: none;
  font-size: var(--font-size-normal);
  color: var(--color-gray-800);
  box-sizing: border-box;
}

.form-control:focus {
  border-color: var(--color-primary);
}

.form-switch {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.form-error {
  margin: 0;
  font-size: var(--font-size-small);
  color: #dc2c26;
}
</style>