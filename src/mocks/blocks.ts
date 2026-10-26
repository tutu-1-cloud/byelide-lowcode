import type { BlockInfo } from '@/types/block'

export const blocks: BlockInfo[] = [
  {
    id: '1',
    type: 'quote',
    label: '斯蒂芬李会计',
    props: { content: '这是一段引述文本', status: 'success' }
  },
  {
    id: '2',
    type: 'heroTitle',
    label: '标题',
    props: { content: 'Hero Title Block' }
  },
  {
    id: '3',
    type: 'image',
    label: '图片',
    props: {
      url: 'https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1600'
    }
  },
  { id: '4', type: 'view', label: '视图', props: {} },
  { id: '5', type: 'chart', label: '图表', props: {} },
  { id: '6', type: 'button', label: '按钮', props: { content: 'Button' } },
  { id: '7', type: 'form', label: '表单', props: {} },
  { id: '8', type: 'notes', label: '笔记', props: { content: 'Notes Block' } }
]