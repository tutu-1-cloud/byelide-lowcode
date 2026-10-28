export type BasicBlockType = 'heroTitle' | 'view' | 'chart' | 'quote' | 'image'
export type ExternalBlockType = 'button' | 'form' | 'notes'
export type BlockType = BasicBlockType | ExternalBlockType
export type ChartKind = 'line' | 'bar' | 'pie'
export type QuoteBlockStatus = 'success' | 'warning' | 'error'
export type FormFieldType = 'text' | 'number' | 'select' | 'switch'

export interface BaseBlockInfo {
  id: string
  label: string
}

export interface QuoteBlockInfo extends BaseBlockInfo {
  type: 'quote'
  props: {
    content: string
    status: QuoteBlockStatus
  }
}

export interface HeroTitleBlockInfo extends BaseBlockInfo {
  type: 'heroTitle'
  props: {
    content: string
  }
}

export interface ImageBlockInfo extends BaseBlockInfo {
  type: 'image'
  props: {
    url: string
  }
}

export interface ButtonBlockInfo extends BaseBlockInfo {
  type: 'button'
  props: {
    content: string
  }
}

export interface NotesBlockInfo extends BaseBlockInfo {
  type: 'notes'
  props: {
    content: string
  }
}

// 这几个物料还没实现，props 先空着（注意：`{}` 是个很松的类型）
export interface ViewBlockInfo extends BaseBlockInfo {
  type: 'view'
  props: Record<string, never>
}

export interface ChartBlockInfo extends BaseBlockInfo {
  type: 'chart'
  props: {
    chartKind: ChartKind
    data: {
      label: string
      value: number
    }[]
  }
}

export interface FormFieldSchema {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

export interface FormBlockInfo extends BaseBlockInfo {
  type: 'form'
  props: {
    fields: FormFieldSchema[]
    submitText: string
  }
}

export type BlockInfo =
  | QuoteBlockInfo
  | HeroTitleBlockInfo
  | ImageBlockInfo
  | ButtonBlockInfo
  | NotesBlockInfo
  | ViewBlockInfo
  | ChartBlockInfo
  | FormBlockInfo