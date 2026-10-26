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
import { nanoid } from 'nanoid'


import type { BlockInfo, BlockType } from '@/types/block'

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

export const getBlocksDefaultData = (type: BlockType): BlockInfo => {
  const id = nanoid()

  switch (type) {
    case 'quote':
      return { id, type, label: '引述', props: { content: '新引述', status: 'success' } }
    case 'heroTitle':
      return { id, type, label: '标题', props: { content: '新标题' } }
    case 'image':
      return {
        id,
        type,
        label: '图片',
        props: {
          url: 'https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1600'
        }
      }
    case 'button':
      return { id, type, label: '按钮', props: { content: '按钮' } }
    case 'notes':
      return { id, type, label: '笔记', props: { content: '' } }
    case 'view':
    case 'chart':
    case 'form':
      return { id, type, label: blocksBaseMeta[type].label, props: {} }
  }
}