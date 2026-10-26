import type { Component } from 'vue'
import type { App } from 'vue'

import QuoteBlock from '@/blocks/basic/QuoteBlock.vue'
import HeroTitleBlock from '@/blocks/basic/HeroTitleBlock.vue'
import ViewBlock from '@/blocks/basic/ViewBlock.vue'
import ChartBlock from '@/blocks/basic/ChartBlock.vue'
import ImageBlock from '@/blocks/basic/ImageBlock.vue'
import ButtonBlock from '@/blocks/external/ButtonBlock.vue'
import FormBlock from '@/blocks/external/FormBlock.vue'
import NotesBlock from '@/blocks/external/NotesBlock.vue'
import type { BlockType } from '@/types/block'

export type BlockMaterial = {
  type: BlockType
  material: Component
}

export type BlocksMap = Record<string, BlockMaterial>

const baseBlocks: BlockMaterial[] = [
  { type: 'quote', material: QuoteBlock },
  { type: 'heroTitle', material: HeroTitleBlock },
  { type: 'view', material: ViewBlock },
  { type: 'chart', material: ChartBlock },
  { type: 'image', material: ImageBlock }
]

class BlockSuite {
  private blocks = baseBlocks

  getBlocksMap(): BlocksMap {
    return Object.fromEntries(this.blocks.map((block) => [block.type, block]))
  }

  getBlocks(): BlockMaterial[] {
    return this.blocks
  }

  addBlock(block: BlockMaterial) {
    this.blocks.push(block)
  }

  hasBlock(type: BlockType) {
    return !!this.getBlocksMap()[type]
  }
}

const blockSuite = new BlockSuite()

console.log('🚀 注册前 button:', blockSuite.hasBlock('button'))

blockSuite.addBlock({ type: 'button', material: ButtonBlock })
blockSuite.addBlock({ type: 'form', material: FormBlock })
blockSuite.addBlock({ type: 'notes', material: NotesBlock })

console.log('🚀 注册后 button:', blockSuite.hasBlock('button'))

const blocksMap = blockSuite.getBlocksMap()

export const blocksMapSymbol = Symbol('blocksMap')

export const setup = (app: App<Element>) => {
  const ins = {
    install(app: App<Element>) {
      app.provide(blocksMapSymbol, blocksMap)
      app.config.globalProperties.$blocksMap = blocksMap
    }
  }

  app.use(ins)
}

// declare module 'vue' 不是"新建一个模块"，
// 而是"我要往已有的 'vue' 模块里加东西"。
// TS 会把 ComponentCustomProperties 接口和 Vue 原本的合并，于是 $blocksMap 就有了类型
// interface接口同名时会自动合并
declare module 'vue' {
  interface ComponentCustomProperties {
    $blocksMap: BlocksMap
  }
}