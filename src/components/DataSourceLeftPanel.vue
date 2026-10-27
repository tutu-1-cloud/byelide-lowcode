<script setup lang="ts">
import { DataSheet } from '@icon-park/vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeLink = computed(() => route.path)

const dataLists = [
  { id: '1', name: '数据源1' },
  { id: '2', name: '数据源2' },
  { id: '3', name: '数据源3' },
  { id: '4', name: '数据源4' },
  { id: '5', name: '数据源5' }
]
</script>

<template>
  <div class="ds-left-panel-wrapper">
    <div class="ds-left-panel-content">
      <RouterLink
        v-for="ds in dataLists"
        :key="ds.id"
        :class="['ds-item', activeLink.includes(ds.id) && 'active']"
        :to="`/app/dataSource/${ds.id}`"
      >
        <DataSheet />
        <div class="item-label">{{ ds.id }} · 100w 行数据，非常流畅</div>
      </RouterLink>
    </div>
  </div>
</template>