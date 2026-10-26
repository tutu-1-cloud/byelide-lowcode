import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { blocks as blocksData } from '@/mocks/blocks'
import type { BlockInfo } from '@/types/block'

export const useAppEditorStore = defineStore('appEditor', () => {
  const blocks = ref<BlockInfo[]>(blocksData)
  const currentBlockId = ref<string | null>(null)

  const selectedBlock = computed<BlockInfo | null>(() => {
    if (!currentBlockId.value) return null
    return blocks.value.find((b) => b.id === currentBlockId.value) ?? null
  })

  function selectBlock(id: string) {
    currentBlockId.value = id
  }

  function addBlock(newBlock: BlockInfo) {
    blocks.value.push(newBlock)
  }

  function updateBlocks(newBlocks: BlockInfo[]) {
    blocks.value = newBlocks
  }

  function updateBlockProps(id: string, patch: Record<string, unknown>) {
    const target = blocks.value.find((b) => b.id === id)
    if (!target) return
    Object.assign(target.props, patch)
  }

  function removeBlock(id: string) {
    blocks.value = blocks.value.filter((b) => b.id !== id)
    if (currentBlockId.value === id) {
      currentBlockId.value = null
    }
  }

  return {
    blocks,
    currentBlockId,
    selectedBlock,
    selectBlock,
    addBlock,
    updateBlocks,
    updateBlockProps,
    removeBlock
  }
})