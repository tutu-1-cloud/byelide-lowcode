<script setup lang="ts">
    const props = defineProps<{ label: string }>()
</script>

<template>
  <div class="setting-field">
    <label class="setting-field-label">{{ props.label }}</label>
    <slot />
  </div>
</template>

<style scoped>
.setting-field {
  margin-bottom: 12px;
}

.setting-field-label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--font-size-small);
  color: var(--color-gray-800);
}
</style>