<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const activeTab = computed(() => String(route.name ?? ''))

const tabs = [
  { path: '/app/dataSource', name: 'dataSource', label: '数据源' },
  { path: '/app/layout', name: 'layout', label: '布局' },
  { path: '/app/actions', name: 'actions', label: '动作' }
]
</script>

<template>
  <div class="app-wrapper">
    <header class="app-header">
      <nav class="temp-nav">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          class="nav-item"
          :class="{ active: activeTab === tab.name }"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.app-header {
  flex-shrink: 0;
  height: 48px;
  border-bottom: 1px solid var(--color-gray-300);
}

.temp-nav {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  gap: 8px;
}

.nav-item {
  padding: 6px 12px;
  border-radius: 6px;
  color: var(--color-gray-800);
  font-size: var(--font-size-normal);
  text-decoration: none;
}

.nav-item:hover {
  background-color: var(--color-gray-100);
}

.nav-item.active {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>