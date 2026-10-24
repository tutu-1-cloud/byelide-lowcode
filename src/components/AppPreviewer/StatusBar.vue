<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const time = ref(new Date().toLocaleTimeString())

let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    time.value = new Date().toLocaleTimeString()
  }, 1000)
})

onBeforeUnmount(() => {
  timer && window.clearInterval(timer)
})
</script>

<template>
  <div class="status-bar">
    <svg width="393" height="54" viewBox="0 0 393 54" fill="var(--color-white)">
      <text font-family="-apple-system, sans-serif" font-size="17" font-weight="700" x="36" y="36">
        {{ time }}
      </text>
      <rect x="134" y="11" width="124" height="36" rx="18" fill="black" />
      <g>
        <rect x="282" y="26" width="4" height="9" rx="1" />
        <rect x="288" y="22" width="4" height="13" rx="1" />
        <rect x="294" y="18" width="4" height="17" rx="1" />
        <rect x="300" y="14" width="4" height="21" rx="1" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.status-bar {
  background-color: var(--color-primary);
}
</style>