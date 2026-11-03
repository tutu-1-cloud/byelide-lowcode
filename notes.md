# Byelide 低代码平台 · 开发笔记

> 基于 Vue 3 + TypeScript 从零实现的低代码页面搭建平台。
> 记录内容：技术选型与依据、架构设计、核心实现、技术难点与解决方案、构建与性能优化。

---

## 0. 项目定位

**物料 → 编排 → 配置 → 出码 → 运行时渲染**，实现的是「低代码平台的核心子系统」：
模型驱动搭建 + 统一运行时 + Schema 出码。

并非完整的 LCAP（缺少发布、版本、权限等能力），但覆盖了其中技术含量最高的部分。

---

## 1. 技术选型

### 1.1 核心技术栈

| 技术 | 版本 | 选型依据 |
|---|---|---|
| **Vue 3.5** | `^3.5.44` | `<script setup>` + 组合式 API，类型推导良好；`defineProps` 泛型使物料协议可定义为 TypeScript interface |
| **TypeScript** | `~6.0.3` | 物料协议、Schema、Props 契约均依赖类型保证；`type` 字面量联合是可辨识联合的基础 |
| **Vite 8** | `^8.3.4` | 构建基于 **Rolldown**（Rust 实现），冷启动与 HMR 速度快；原生支持 `import.meta.url` 路径别名 |
| **Pinia** | `^4.1.0` | setup store 写法与组合式 API 同构；`storeToRefs` 可明确规避「解构丢失响应式」问题 |
| **vue-router 5** | `^5.4.0` | 三层嵌套路由：`AppView` → `PageLayoutView / DataSourceView / ActionsView` → 子路由 |

### 1.2 功能库

| 技术 | 用途 | 选型说明 |
|---|---|---|
| **smooth-dnd** | 物料拖拽排序、跨容器拖入 | 轻量（约 10 KB），无 DOM 所有权问题；需自行编写 Vue 封装（见 4.1） |
| **echarts + vue-echarts** | 图表 | 功能齐全，`use([...])` 支持按需注册 |
| **vee-validate 4** | 表单校验 | 组合式 API 风格（`useForm` / `useField`），不接管 DOM |
| **@vue-flow/core** 及 background / controls / minimap | 流程画布 | Vue 3 生态中成熟的节点编辑器；仅负责可视化，执行与序列化由项目自行实现 |
| **React 18 + @glideapps/glide-data-grid** | 数据源详情表格 | 内嵌于 Vue，提供高性能虚拟滚动数据表格 |
| **@icon-park/vue-next** | 图标 | 按需引入，利于 tree-shaking |
| **nanoid** | ID 生成 | 短且 URL 友好 |
| **vue-json-pretty** | Schema 展示 | 轻量，可控制展开层级（`:deep`） |
| **copy-text-to-clipboard** | 复制功能 | 单行 API，返回 Boolean |
| **rollup-plugin-visualizer** | 包体分析 | 生成 treemap，定位体积构成 |

### 1.3 明确未采用的方案

| 方案 | 未采用原因 |
|---|---|
| **三套图表渲染器 + 分发器** | 属于演示性复杂度，对用户无实际意义；简化为 `chartKind: 'line' \| 'bar' \| 'pie'` 单一业务字段 |
| **BPM 流程引擎**（会签 / 加签 / 审批） | 属于「人参与」的另一产品线，混入会导致项目失焦 |
| **事件系统（`block.events`）** | Demo 阶段价值低；代价是按钮暂无法触发流程 |
| **图表 / 流程的前端执行器** | 流程执行天然位于后端，前端仅负责编排与预览 |

---

## 2. 架构设计

### 2.1 目录结构

```
src/
├── blocks/                     物料：协议的实现
│   ├── BlockRenderer.vue       块列表 + 拖拽 + 选中 + 工具栏
│   ├── basic/                  quote / heroTitle / image / view / chart(+ChartRenderer)
│   └── external/               button / form(+FormFieldItem) / notes
├── components/
│   ├── AppNavigator.vue        顶部导航（数据源 / 布局 / 动作 / 开发模式 / 发布）
│   ├── AppLeftPanel/           物料抽屉 + 大纲
│   ├── AppPreviewer/           设备模拟器（笔记本框，含 LaptopPreviewer.vue）
│   ├── AppRightPanel/          配置面板（基础 + 专属 + 出码）
│   ├── AppRunnerRenderer/      运行时根（provide editable=false）
│   ├── DataSourceLeftPanel.vue 数据源侧边栏
│   ├── Flow/                   流程编辑器（画布 / 工具栏 / 检查器 / schema）
│   └── SmoothDnd/              smooth-dnd 的 Vue 封装
├── constants/blocksBaseMeta.ts 物料元信息 + 默认数据工厂
├── mocks/blocks.ts             初始块数据
├── stores/                     appEditor / debug(env)
├── types/block.ts              物料协议（可辨识联合）
├── ui/                         SettingField / SegmentedControl
├── utils/array.ts              arrayMove 等工具函数
├── views/                      AppView / PageLayoutView / DataSourceView / ActionsView / RunnerView
├── setup.ts                    物料注册中心（BlockSuite）
├── main.ts                     应用入口
└── App.vue                     根组件
```

### 2.2 四条数据流

```
① 编排：BlocksDrawer ──drop──► BlockRenderer ──updateBlocks──► store.blocks
② 配置：AppRightPanel ──emit(patch)──► updateBlockProps ──Object.assign──► block.props
③ 渲染：store.blocks ──v-for──► BlockRenderer ──$blocksMap[type].material──► 物料组件
④ 运行：AppRunnerRenderer ──provide('editable', false)──► 所有物料只读
```

**核心原则**：

- **状态唯一**：状态集中于 Pinia `appEditor` store，组件之间不直接通信，均读取同一 store。
- **变更走替换或原地补丁**：不通过「改字段」的方式更新数据，以保证受控渲染。
- **物料仅接收 `blockInfo` 一个 prop**。
- **协议必须可序列化**：不存储函数、组件或类实例。

### 2.3 物料协议（`types/block.ts`）

```ts
interface BaseBlockInfo { id: string; label: string }

interface QuoteBlockInfo extends BaseBlockInfo {
  type: 'quote'
  props: { content: string; status: 'success' | 'warning' | 'error' }
}
// ... 共 8 种物料，通过 type 字面量组成可辨识联合
type BlockInfo = QuoteBlockInfo | HeroTitleBlockInfo | ... | FormBlockInfo
```

采用「联合类型」而非「通用 props」的原因：`switch (block.type)` 时可自动收窄，写错 `type` 会立即报类型错误。

---

## 3. 核心模块

### 3.1 物料注册中心（BlockSuite）

```ts
class BlockSuite {
  private blocksMap: Record<string, { material: Component }> = {}
  addBlock(config) { ... }
  getBlocksMap() { ... }
}
```

- 实例于 `setup.ts` 中创建并注册 8 个物料。
- 通过 `provide(symbol)` 与 `app.config.globalProperties.$blocksMap` **双通道**暴露。
- 收益：新增物料无需修改渲染器；模板中可直接使用 `$blocksMap[type].material`。

### 3.2 拖拽封装（SmoothDnd）

`smooth-dnd` 为命令式库，自行管理 DOM。封装要点：

- 使用 `defineComponent` + `render()` 手写渲染函数，**不接管被拖元素的 DOM**。
- `wrapChild: false`：不额外包裹 wrapper，避免破坏用户 CSS。
- 组件卸载时必须调用 `dispose()`。
- `.smooth-dnd-draggable-wrapper` 的样式需写在**全局**作用域中（库动态创建的元素无法获取 scoped 的 `data-v-*` 属性）。

### 3.3 配置面板（patch 契约）

```ts
// 面板侧：仅传递补丁
emit('change', { content: '新内容' })
// 外壳侧：合并补丁
store.updateBlockProps(id, patch)   // Object.assign(target.props, patch)
```

- 面板**不持有状态**，所有值均从 `props.blockInfo` 读取。
- `label`（实例名称）与 `props`（内容）分两条通道：`changeLabel` / `change`。
- 面板映射采用 `Partial<Record<BlockType, Component>>` 而非 `switch`——**key 写错即报类型错误，且允许仅实现部分物料的配置面板**。

### 3.4 图表（echarts 按需引入）

```ts
use([LineChart, BarChart, PieChart, GridComponent, TooltipComponent, CanvasRenderer])
```

- `chartKind` 决定 series 类型，`data` 决定数据。
- `<VChart autoresize />` 负责尺寸自适应。
- 注意：`graphic.LinearGradient` 等实例**不可写入 Schema**（不可序列化）。

### 3.5 表单（vee-validate 动态字段）

难点：**字段名在运行时才确定**，而 `defineField('content')` 要求编译期已知。

解决方案：**每个字段对应一个子组件**。

```
FormBlock.vue          useForm({ initialValues })   → 提供表单上下文
  └─ FormFieldItem.vue useField(() => props.field.name, rules)  → 注册单个字段
```

- 规则通过 `defineRule('required' / 'numeric')` 自行注册（v4 核心不含规则集）。
- `defineRule` 须置于**独立的 `<script>` 块**中（仅执行一次），若放在 `<script setup>` 中会随每个实例重复注册。
- 提交：`handleSubmit(cb)` 校验通过后才调用 `cb(formValues)`；`editable` 为 true 时仅校验不提交。

### 3.6 数据源（React 高性能表格）

数据源详情页采用 **Vue 内嵌 React** 的方案，使用 `@glideapps/glide-data-grid` 渲染高性能虚拟滚动表格。

实现方式（`DataSourceContent.vue`）：

```ts
import { createRoot } from 'react-dom/client'
import { createElement as reactCreateElement } from 'react'

onMounted(() => {
  root = createRoot(hostRef.value)
  root.render(reactCreateElement(ReactDataSource))
})
onBeforeUnmount(() => { root?.unmount() })
```

通过 `react-dom/client` 的 `createRoot` 将 React 表格组件挂载到 Vue 的容器 div 上，组件卸载时调用 `root.unmount()` 释放资源。

> 目录中另有 `CanvasTable.vue`（自研 canvas 虚拟滚动表格），当前未被路由使用，作为备选方案保留。

### 3.7 出码

- 页面出码：`SchemaExporter` 使用 `vue-json-pretty` 展示**当前选中块**的 Schema，支持复制。
- 流程出码：`Flow/schema.ts` 的 `exportSchema()` 执行**白名单转换**（画布对象 → 干净 JSON）。

```ts
exportSchema(nodes, edges) → {
  version: '1.0',
  nodes: [{ id, type, label, config, position }],
  edges: [{ id, source, target, type?, label? }]
}
```

关键点：`data` 被展平为 `label + config`，且 `config` 按节点类型进行白名单过滤（如 input 节点仅保留 `source`）。

### 3.8 运行时（Runner）

```ts
// AppRunnerRenderer.vue
provide('editable', false)
```

- 物料中通过 `inject('editable', true)` 获取，编辑器默认为 `true`。
- 运行态下：不显示工具栏、不可拖拽、表单提交才真正执行。
- 注意：`provide` 的值可能是 `ref`，脚本中需使用 `unref` 统一处理（模板会自动解包，易造成误判）。

---

## 4. 技术难点与解决方案

### 4.1 smooth-dnd 与 Vue 的 DOM 所有权冲突

**现象**：`Template ref "container" used on a non-ref value`，拖拽失效。
**原因**：`setup()` 中声明了 `container: null`，而 `render()` 中使用字符串 ref `'container'`，Vue 无法确定该 DOM 归属。
**解决**：删除字符串 ref，改用组件实例的 `this.$el`；内部字段重命名以避免冲突（如 `dnd`）。

### 4.2 scoped 样式无法作用于第三方库的 DOM

| 场景 | 解决方式 |
|---|---|
| `.smooth-dnd-draggable-wrapper` | 写入全局 `<style>` |
| vue-flow 的 `.vue-flow__node` / `__minimap` / `__controls-button` | 写入全局 `<style>` 或使用 `:deep()` |

**根因**：scoped 会为选择器添加 `[data-v-xxx]` 属性，而第三方库动态创建的 DOM 不具备该属性。

### 4.3 构建与类型相关

| 问题 | 原因 | 解决 |
|---|---|---|
| `TS5101: baseUrl is deprecated` | TypeScript 6 已弃用 `baseUrl` | 删除 `baseUrl`，`paths` 相对 tsconfig 文件解析（TS 4.1+ 起支持） |
| `TS2551: Property 'value' does not exist` | vue-tsc 在**模板内联箭头函数 + 索引访问导入绑定**时误插入 `.value` | 将回调提取到 `<script setup>` 中（如 `getChildPayload`） |
| `TS2589: Type instantiation excessively deep` | `@vue-flow/core` 的 `Node` 泛型层级过深，`Array.find` 推导爆炸 | 改用 `for...of` 循环遍历，或对结果加类型断言 |
| `vue-json-pretty` 类型不匹配 | 其 `data` 声明为 `JSONDataType`（含 unknown） | 引入 `import type { JSONDataType }` 后显式标注类型 |

### 4.4 白屏级故障

| 问题 | 原因 |
|---|---|
| 编辑器无法纵向滚动 | `LaptopPreviewer.vue` 的 `<style>` 块整体缺失，导致 `flex: 1` 链路中断 |
| 画布高度为 0（空白且无报错） | `flex: 1` 缺少 `min-height: 0` |

### 4.5 Vue Flow

| 问题 | 原因 | 解决 |
|---|---|---|
| 导出数据包含 `computedPosition` / `dimensions` 等内部字段 | 直接存储了 `toObject()` 的结果 | 编写 `toSchema` 白名单转换函数 |
| 无法拖出连线且无报错 | 自定义节点中未渲染 `<Handle>` | 补充 `Handle` 组件 |
| `useVueFlow()` 无法获取实例 | 在 `<VueFlow>` 的兄弟或子组件中调用 | 必须在**祖先组件**中调用 |
| 节点操作出现「丢失 / 复活」 | `:nodes`（单向绑定）与 `addNodes/removeNodes`（修改内部 store）混用 | 统一使用本地数组管理节点 |

### 4.6 Vite 8 + Rolldown 分包

| 问题 | 原因 | 解决 |
|---|---|---|
| `manualChunks` 配置无效且无报错 | Rolldown 已废弃该选项，与 `codeSplitting` 同时出现时被静默忽略 | 改用 `build.rolldownOptions.output.codeSplitting.groups` |
| `splitVendorChunkPlugin` 导入失败 | Vite 5 起废弃，新版已移除 | 直接使用 `codeSplitting` |
| `esbuild.drop` 无法删除 console | Vite 8 压缩由 **Oxc** 处理，Rolldown 未暴露 `dropConsole` | 改用 `build.minify: 'terser'` 配合 `terserOptions`，或不做处理 |
| 拆包后首屏体积未减小且多出 preload | `codeSplitting.groups` 默认 `includeDependenciesRecursively: true`，将 `vue`（`vue-echarts` 的 peer 依赖）吞入 echarts 分组 | 配置 `includeDependenciesRecursively: false`，并显式分出 `vue-common-lib` 分组 |
| Windows 下分组规则均不命中 | 正则使用 `node_modules/xxx`，而 Windows 路径为反斜杠 | 使用 `[\\/]` 匹配 |
| 目标端分组冲突 | `@vue-flow` 同时匹配 `@vue` 规则 | 通过 `priority` 控制归属 |

最终配置（`vite.config.ts`）：

```ts
codeSplitting: {
  includeDependenciesRecursively: false,
  groups: [
    { name: 'vue-common-lib', test: /node_modules[\\/](vue|@vue|vue-router|pinia)[\\/]/, priority: 50 },
    { name: 'vue-flow',       test: /node_modules[\\/]@vue-flow[\\/]/, priority: 40 },
    { name: 'echarts',        test: /node_modules[\\/](echarts|zrender|vue-echarts)[\\/]/, priority: 20 },
    { name: 'validate',       test: /node_modules[\\/]vee-validate[\\/]/, priority: 10 }
  ]
}
```

---

## 5. 构建与性能

### 5.1 优化前基线（`pnpm build` 实测）

| chunk | 原始 | gzip | 是否首屏 |
|---|---|---|---|
| `index` | 677.44 kB | **231.32 kB** | 是 |
| `DataSourceContent`（React 表格） | 416.04 kB | 134.13 kB | 否 |
| `ActionsView`（vue-flow） | 219.28 kB | 71.89 kB | 否 |
| 其他 | ~130 kB | ~42 kB | 按需 |
| **合计** | ~1.44 MB | **~480 kB** | — |

### 5.2 已实施的优化

| 优化项 | 做法 | 效果 |
|---|---|---|
| **图表异步化** | `ChartBlock` 精简为壳组件，echarts 逻辑迁移至 `ChartRenderer.vue`，通过 `defineAsyncComponent` 引入 | `index` 体积由 677 kB 显著下降 |
| 包体分析 | 使用 `rollup-plugin-visualizer` 生成 `bundle-analysis.html` | 可定位体积构成 |
| Flow 节点原地更新 | 使用 `n.data = { ...n.data, ...patch }` 替代整数组重建 | 修改配置时仅重渲染目标节点 |
| 分包策略 | 配置 `codeSplitting.groups`，按库拆分 chunk | 提升缓存粒度 |

### 5.3 性能优化方法论

| 手段 | 改变内容 | 是否能降低首屏体积 |
|---|---|---|
| `visualizer` | 仅观察 | — |
| `codeSplitting.groups` | 文件**分组方式** | ❌ **不能**（静态依赖仍于首屏加载） |
| 动态 `import()` / `defineAsyncComponent` | **加载时机** | ✅ **能** |
| 删除依赖 | 总体积 | ✅ 能 |

**首屏体积 = 入口 chunk + 其静态依赖 chunk 的 gzip 之和。** 拆包提升的是**缓存粒度**，而非首屏体积；唯有动态加载才能真正降低首屏体积。
