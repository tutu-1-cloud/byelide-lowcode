<script setup lang="ts">
const props = defineProps<{
  name: 'reset' | 'sun' | 'moon'
}>()

const paths: Record<string, string> = {
  reset: 'M512 512m-448 0a448 448 0 1 0 896 0a448 448 0 1 0 -896 0M512 263v199l132 79',
  sun: 'M512 352a160 160 0 1 0 0 320a160 160 0 1 0 0 -320M512 64v96M512 864v96M200 200l68 68M756 756l68 68M64 512h96M864 512h96M200 824l68 -68M756 268l68 -68',
  moon: 'M616 168a344 344 0 1 0 -104 472a288 288 0 0 0 288 -408a350 350 0 0 1 -184 -64z',
}
</script>

<template>
  <svg viewBox="0 0 1024 1024" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path :d="paths[props.name]" fill="currentColor" />
  </svg>
</template>
