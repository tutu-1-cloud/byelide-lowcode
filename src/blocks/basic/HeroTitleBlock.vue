<script setup lang="ts">
import type { HeroTitleBlockInfo } from '@/types/block'

defineProps<{ blockInfo: HeroTitleBlockInfo }>()
</script>

<template>
  <h1 class="hero-title">{{ blockInfo.props.content }}</h1>
</template>

<style scoped>
.hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}
</style>