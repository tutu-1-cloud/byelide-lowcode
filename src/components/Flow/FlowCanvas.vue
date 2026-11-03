<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow, type Edge, type Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { nanoid } from 'nanoid'
import { Copy } from '@icon-park/vue-next'
import copyText from 'copy-text-to-clipboard'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

import FlowIcon from './FlowIcon.vue'
import FlowToolbar from './FlowToolbar.vue'
import FlowInspector from './FlowInspector.vue'
import { initialEdges, initialNodes } from './initial-elements'
import { exportSchema, type FlowSchema } from './schema'

const { onInit, onConnect, onNodeClick, addNodes, addEdges, removeNodes, setViewport } = useVueFlow()

const nodes = ref<Node[]>(initialNodes)
const edges = ref<Edge[]>(initialEdges)
const selectedNode = ref<Node | null>(null)

// 出码弹窗
const exportModalVisible = ref(false)
const exportedJson = ref<FlowSchema | null>(null)
const copied = ref(false)

// 初始化时自适应视图
onInit((vueFlowInstance) => {
  vueFlowInstance.fitView()
})

// 连接新边
onConnect((connection) => {
  addEdges(connection)
})

// 点击节点选中
onNodeClick(({ node }) => {
  selectedNode.value = node
})

// 各类型节点的默认专属字段
const typeDefaultData: Record<string, Record<string, string>> = {
  input: { source: '' },
  default: { action: '' },
  output: { target: '' },
}

// 新增节点
function handleAddNode(type: 'input' | 'default' | 'output') {
  const id = nanoid(6)
  const label = type === 'input' ? '输入节点' : type === 'output' ? '输出节点' : '普通节点'
  const newNode = {
    id,
    type,
    data: { label: `${label} ${id}`, ...typeDefaultData[type] },
    position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
  } as Node
  addNodes(newNode)
  selectedNode.value = newNode
}

// 更新节点数据
function handleUpdateData(id: string, patch: Record<string, unknown>) {
  for (const n of nodes.value) {
    if (n.id !== id) continue
    n.data = { ...n.data, ...patch }
    if (selectedNode.value?.id === id) {
      selectedNode.value.data = n.data
    }
    break
  }
}

// 删除节点
function handleDeleteNode(id: string) {
  removeNodes([id])
  if (selectedNode.value?.id === id) {
    selectedNode.value = null
  }
}

// 出码
function handleExport() {
  exportedJson.value = exportSchema(nodes.value as Node[], edges.value as Edge[])
  exportModalVisible.value = true
}

function copyJson() {
  if (!exportedJson.value) return
  const ok = copyText(JSON.stringify(exportedJson.value, null, 2))
  if (ok) {
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  }
}

// 重置视口缩放与平移
function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}
</script>

<template>
  <div class="flow-canvas-wrapper">
    <FlowToolbar @add-node="handleAddNode" @export="handleExport" />

    <div class="flow-main">
      <div class="flow-canvas-area">
        <VueFlow :nodes="nodes" :edges="edges" class="basic-flow" :default-viewport="{ zoom: 1.5 }">
          <Background pattern-color="#aaa" :gap="16" />
          <MiniMap />

          <Controls position="top-left">
            <ControlButton title="Reset Transform" @click="resetTransform">
              <FlowIcon name="reset" />
            </ControlButton>
          </Controls>
        </VueFlow>
      </div>

      <div class="flow-inspector-area">
        <FlowInspector
          :node="selectedNode"
          @update-data="handleUpdateData"
          @delete-node="handleDeleteNode"
        />
      </div>
    </div>

    <!-- 出码弹窗 -->
    <div v-if="exportModalVisible" class="export-mask" @click.self="exportModalVisible = false">
      <div class="export-modal">
        <div class="export-header">
          <span class="export-title">出码 - Flow JSON</span>
          <button class="export-copy" :class="{ copied }" @click="copyJson">
            <Copy :size="14" />
            {{ copied ? '已复制' : '复制' }}
          </button>
          <button class="export-close" @click="exportModalVisible = false">×</button>
        </div>
        <div class="export-body tiny-scrollbar">
          <VueJsonPretty :data="exportedJson" show-icon show-line-number :deep="3" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow-canvas-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.flow-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.flow-canvas-area {
  flex: 1;
  overflow: hidden;
}

.flow-inspector-area {
  flex-shrink: 0;
  width: var(--panel-width);
  border-left: 1px solid var(--color-gray-300);
  overflow: hidden;
}

.basic-flow {
  width: 100%;
  height: 100%;
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.basic-flow .vue-flow__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.basic-flow .vue-flow__controls .vue-flow__controls-button {
  border: none;
  border-right: 1px solid #eee;
}

.basic-flow .vue-flow__controls .vue-flow__controls-button svg {
  height: 100%;
  width: 100%;
}

.export-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.export-modal {
  width: 640px;
  max-width: 90vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: var(--color-white);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.export-header {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-gray-300);
}

.export-title {
  flex: 1;
  font-size: var(--font-size-normal);
  font-weight: var(--font-weight-bolder);
}

.export-copy {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background-color: var(--color-white);
  color: var(--color-gray-800);
  font-size: var(--font-size-small);
  cursor: pointer;
}

.export-copy:hover,
.export-copy.copied {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.export-close {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 20px;
  color: var(--color-gray-700);
  cursor: pointer;
}

.export-close:hover {
  background-color: var(--color-gray-100);
}

.export-body {
  flex: 1;
  overflow: auto;
  padding: 12px;
  font-size: 12px;
}
</style>
