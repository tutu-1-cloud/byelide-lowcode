<script setup lang="ts">
import type { ChartBlockInfo, ChartKind } from '@/types/block'
import SegmentedControl from '@/ui/SegmentedControl/SegmentedControl.vue'
import SettingField from '@/ui/SettingField.vue'

const props = defineProps<{
  blockInfo: ChartBlockInfo
}>()

const emit = defineEmits<{
  change: [patch: Partial<ChartBlockInfo['props']>]
}>()

const chartKindOptions: { value: ChartKind; label: string }[] = [
  { value: 'line', label: '折线' },
  { value: 'bar', label: '柱状' },
  { value: 'pie', label: '饼图' }
]

const handleKindChange = (value: string) => {
  emit('change', { chartKind: value as ChartKind })
}
</script>

<template>
  <SettingField label="图表类型">
    <SegmentedControl
      :model-value="props.blockInfo.props.chartKind"
      :data="chartKindOptions"
      @update:model-value="handleKindChange"
    />
  </SettingField>
</template>