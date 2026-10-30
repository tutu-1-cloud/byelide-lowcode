<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Add, Code } from '@icon-park/vue-next'

const emit = defineEmits<{
  addNode: [type: 'input' | 'default' | 'output']
  export: []
}>()

const menuVisible = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const nodeTypes: { type: 'input' | 'default' | 'output'; label: string }[] = [
  { type: 'input', label: '输入节点' },
  { type: 'default', label: '普通节点' },
  { type: 'output', label: '输出节点' },
]

function toggleMenu() {
  menuVisible.value = !menuVisible.value
}

function handleSelect(type: 'input' | 'default' | 'output') {
  emit('addNode', type)
  menuVisible.value = false
}

function handleOutsideClick(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    menuVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div class="flow-toolbar">
    <div class="toolbar-group">
      <div ref="wrapperRef" class="add-node-wrapper">
        <button class="toolbar-btn primary" @click="toggleMenu">
          <Add :size="16" />
          新增节点
        </button>
        <div v-if="menuVisible" class="add-node-menu">
          <button
            v-for="item in nodeTypes"
            :key="item.type"
            class="menu-item"
            @click="handleSelect(item.type)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="toolbar-group">
      <button class="toolbar-btn" @click="emit('export')">
        <Code :size="16" />
        出码
      </button>
    </div>
  </div>
</template>

<style scoped>
.flow-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-gray-300);
  background-color: var(--color-white);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background-color: var(--color-white);
  color: var(--color-gray-900);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.toolbar-btn.primary {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-white);
}

.toolbar-btn.primary:hover {
  opacity: 0.9;
  color: var(--color-white);
}

.add-node-wrapper {
  position: relative;
}

.add-node-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 4px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background-color: var(--color-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-item {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-gray-900);
  font-size: var(--font-size-small);
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--color-gray-100);
}
</style>
