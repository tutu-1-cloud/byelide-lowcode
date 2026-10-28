<!-- 初始化initValues={
  name: type,
  name: type,
  name:type
} -->
<!-- field通过name匹配form -->
<!-- 遍历fields，传入field{} -->
<!-- 提交表单时，将values提交到formValues -->
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed, inject, unref } from 'vue'
import type { Ref } from 'vue'

import type { FormBlockInfo } from '@/types/block'

import FormFieldItem from './FormFieldItem.vue'

const props = defineProps<{
  blockInfo: FormBlockInfo
}>()

const injected = inject<boolean | Ref<boolean>>('editable', true)
const editable = computed(() => unref(injected))

const fields = computed(() => props.blockInfo.props.fields)

const initialValues = Object.fromEntries(
  fields.value.map((field) => [field.name, field.type === 'switch' ? false : ''])
)

const { handleSubmit, errors, values } = useForm({
  initialValues,
  validateOnMount: false
})

const onSubmit = handleSubmit((formValues) => {
  if (editable.value) return
  window.alert(JSON.stringify(formValues, null, 2))
})
</script>

<template>
  <form class="form-block" @submit.prevent="onSubmit">
    <FormFieldItem v-for="field in fields" :key="field.name" :field="field" />

    <pre v-if="false">{{ JSON.stringify({ errors, values }) }}</pre>

    <button class="form-submit" type="submit">
      {{ props.blockInfo.props.submitText }}
    </button>
  </form>
</template>

<style scoped>
.form-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.form-submit {
  align-self: flex-start;
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background-color: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}
</style>