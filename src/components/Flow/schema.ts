import type { Edge, Node } from '@vue-flow/core'

export const SCHEMA_VERSION = '1.0'

export type NodeType = 'input' | 'default' | 'output'

export interface NodeConfig {
  source?: string
  action?: string
  target?: string
}

export interface FlowNodeSchema {
  id: string
  type: NodeType
  label: string
  config: NodeConfig
  position: { x: number; y: number }
}

export interface FlowEdgeSchema {
  id: string
  source: string
  target: string
  type?: string
  label?: string
}

export interface FlowSchema {
  version: string
  nodes: FlowNodeSchema[]
  edges: FlowEdgeSchema[]
}

// 各类型节点允许的配置字段
const typeConfigKeys: Record<NodeType, (keyof NodeConfig)[]> = {
  input: ['source'],
  default: ['action'],
  output: ['target'],
}

// 画布节点 -> schema
function nodeToSchema(node: Node): FlowNodeSchema {
  const type = (node.type ?? 'default') as NodeType
  const data = (node.data ?? {}) as Record<string, unknown>
  const config: NodeConfig = {}
  for (const key of typeConfigKeys[type] ?? []) {
    const val = data[key]
    if (val) config[key] = val as string
  }
  return {
    id: node.id,
    type,
    label: (data.label as string) ?? '',
    config,
    position: { x: node.position.x, y: node.position.y },
  }
}

// 画布边 -> schema
function edgeToSchema(edge: Edge): FlowEdgeSchema {
  const schema: FlowEdgeSchema = { id: edge.id, source: edge.source, target: edge.target }
  if (edge.type && edge.type !== 'default') schema.type = edge.type
  if (typeof edge.label === 'string' && edge.label) schema.label = edge.label
  return schema
}

// 导出：画布数据 -> FlowSchema
export function exportSchema(nodes: Node[], edges: Edge[]): FlowSchema {
  return {
    version: SCHEMA_VERSION,
    nodes: nodes.map(nodeToSchema),
    edges: edges.map(edgeToSchema),
  }
}
