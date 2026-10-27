export type SegmentedControlItem = {
  value: string
  label: string
}

export interface SegmentedControlProps {
  modelValue: string
  data: SegmentedControlItem[]
}