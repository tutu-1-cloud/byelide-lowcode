<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'

import { isMobileTablet } from '@/utils/detect'

import LaptopPreviewer from '../AppPreviewer/LaptopPreviewer.vue'
import MobilePreviewer from '../AppPreviewer/MobilePreviewer.vue'

provide('editable', false)

const device = ref<'laptop' | 'mobile'>('laptop')

const media = window.matchMedia('(max-width: 768px)')

const syncDevice = () => {
  device.value = isMobileTablet() ? 'mobile' : 'laptop'
}

onMounted(() => {
  syncDevice()
  media.addEventListener('change', syncDevice)
})

onBeforeUnmount(() => {
  media.removeEventListener('change', syncDevice)
})
</script>

<template>
  <div class="runner-renderer">
    <LaptopPreviewer v-if="device === 'laptop'" />
    <MobilePreviewer v-else />
  </div>
</template>

<style scoped>
.runner-renderer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
</style>