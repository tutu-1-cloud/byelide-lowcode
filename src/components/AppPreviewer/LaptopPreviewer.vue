<script setup lang="ts">
import { blocks } from '@/mocks/blocks'
import type { PreviewType } from './type'
import PreviewModeSwitcher from './PreviewModeSwitcher.vue'

const props = defineProps<{
  previewMode?: PreviewType
}>()

const emit = defineEmits<{
  'preview-mode-change': [mode: PreviewType]
}>()

function greet(mode: PreviewType) {
  emit('preview-mode-change', mode)
}
</script>

<template>
  <div class="layout-runner">
    <div class="layout-runner-navigator">
      <div></div>
      <div class="address-wrapper">https://helloword.com/</div>
      <PreviewModeSwitcher :preview-mode="props.previewMode" @preview-mode-change="greet" />
    </div>

    <div class="layout-runner-content-wrapper tiny-scrollbar">
      <div class="layout-runner-content-header">
        <div class="layout-runner-content-navigator"></div>
        <div class="layout-runner-content-title">Byelide</div>
      </div>

      <div class="layout-runner-content">
        <component
          :is="$blocksMap[block.type].material"
          v-for="block in blocks"
          :key="block.id"
          class="block"
        />
      </div>
    </div>
  </div>
</template>