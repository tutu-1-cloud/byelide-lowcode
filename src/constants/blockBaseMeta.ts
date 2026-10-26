import {
  ChartLine,
  Form,
  HamburgerButton,
  ImageFiles,
  Notes,
  Quote,
  Table,
  TitleLevel
} from '@icon-park/vue-next'
import type { Icon } from '@icon-park/vue-next/lib/runtime'

import type { BlockType } from '@/types/block'

export const blocksBaseMetaList: { type: BlockType; label: string; icon: Icon }[] = [
  { type: 'quote', label: '引述', icon: Quote },
  { type: 'notes', label: '笔记', icon: Notes },
  { type: 'heroTitle', label: '超级标题', icon: TitleLevel },
  { type: 'image', label: '图片', icon: ImageFiles },
  { type: 'view', label: '视图', icon: Table },
  { type: 'chart', label: '图表', icon: ChartLine },
  { type: 'button', label: '按钮', icon: HamburgerButton },
  { type: 'form', label: '表单', icon: Form }
]

export const blocksBaseMeta = Object.fromEntries(
  blocksBaseMetaList.map((item) => [item.type, item])
)