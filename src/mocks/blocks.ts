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
  {
    id: '5',
    type: 'chart',
    label: '图表',
    props: {
      chartKind: 'line',
      data: [
        { label: 'Mon', value: 140 },
        { label: 'Tue', value: 232 },
        { label: 'Wed', value: 101 },
        { label: 'Thu', value: 264 },
        { label: 'Fri', value: 90 },
        { label: 'Sat', value: 340 },
        { label: 'Sun', value: 250 }
      ]
    }
  },
  { id: '6', type: 'button', label: '按钮', props: { content: 'Button' } },
  {
    id: '7',
    type: 'form',
    label: '表单',
    props: {
      submitText: '提交',
      fields: [
        {
          name: 'username',
          label: '用户名',
          type: 'text',
          required: true,
          placeholder: '请输入用户名'
        },
        {
          name: 'age',
          label: '年龄',
          type: 'number',
          placeholder: '请输入数字'
        },
        {
          name: 'city',
          label: '城市',
          type: 'select',
          required: true,
          options: [
            { label: '北京', value: 'bj' },
            { label: '上海', value: 'sh' },
            { label: '广州', value: 'gz' }
          ]
        },
        {
          name: 'agree',
          label: '同意条款',
          type: 'switch'
        }
      ]
    }
  },
  { id: '8', type: 'notes', label: '笔记', props: { content: 'Notes Block' } }
]