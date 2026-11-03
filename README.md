# Byelide · 低代码搭建平台

基于 **Vue 3 + TypeScript + Vite** 的低代码页面搭建平台核心子系统，覆盖 **物料 → 编排 → 配置 → 出码 → 运行时渲染** 全链路。不是完整的 LCAP（缺发布、版本、权限），但实现了其中技术含量最高的部分：模型驱动搭建 + 统一运行时 + Schema 出码。

---

## ✨ 功能特性

### 布局编辑器（`/app/layout`）

- **物料编排**：左侧物料抽屉拖入画布，支持同容器排序、跨容器拖入
- **可视化配置**：右侧配置面板，基础信息 + 各物料专属属性，实时生效
- **设备预览**：笔记本外框模拟器，所见即所得
- **Schema 出码**：选中块实时展示 JSON Schema，一键复制

### 数据源（`/app/dataSource`）

- 数据源列表 + 详情
- 内嵌 React 组件 `@glideapps/glide-data-grid` 渲染高性能表格

### 动作 / 流程编排（`/app/actions`）

- 基于 `@vue-flow` 的节点画布，支持输入 / 处理 / 输出三类节点
- 节点连线、拖拽、缩放、小地图
- 节点配置面板 + 白名单 Schema 导出（`exportSchema`）

### 运行时（`/runner`）

- 通过 `provide('editable', false)` 切换只读模式
- 物料禁用拖拽、工具栏，表单提交才真正执行

---

## 🧱 技术栈

| 分类 | 技术                                                                    | 版本              | 说明                                             |
| ---- | ----------------------------------------------------------------------- | ----------------- | ------------------------------------------------ |
| 核心 | Vue                                                                     | `^3.5.44`       | `<script setup>` + 组合式 API                  |
|      | TypeScript                                                              | `~6.0.3`        | 物料协议 / Schema / Props 全靠类型保证           |
| 构建 | Vite                                                                    | `^8.3.4`        | 基于 **Rolldown**（Rust），冷启动 / HMR 快 |
| 状态 | Pinia                                                                   | `^4.1.0`        | setup store，与组合式 API 同构                   |
| 路由 | vue-router                                                              | `^5.4.0`        | 三层嵌套路由                                     |
| 拖拽 | smooth-dnd                                                              | `0.12.1`        | 轻量，需手写 Vue 封装                            |
| 图表 | echarts + vue-echarts                                                   | `5.6` / `7.0` | 按需注册，`chartKind` 决定类型                 |
| 表单 | vee-validate                                                            | `^4.15.1`       | 组合式 API 风格，动态字段                        |
| 流程 | @vue-flow/core + background/controls/minimap                            | `1.48`          | Vue 3 生态唯一成熟节点编辑器                     |
| 表格 | React 18 + @glideapps/glide-data-grid                                   | `18` / `6.0`  | 内嵌于 Vue，高性能数据表格                       |
| 其他 | nanoid / vue-json-pretty / copy-text-to-clipboard / @icon-park/vue-next | —                | id、Schema 展示、复制、图标                      |

---

## 🚀 快速开始

```bash
# 安装依赖（项目使用 pnpm）
pnpm install

# 开发
pnpm dev

# 构建（vue-tsc 类型检查 + vite build）
pnpm build

# 预览构建产物
pnpm preview
```

> Node 版本建议与 `@types/node@^24` 匹配。

---

## 📁 目录结构

```
src/
├── blocks/                     物料：协议的实现
│   ├── BlockRenderer.vue       块列表 + 拖拽 + 选中 + 工具栏
│   ├── basic/                  quote / heroTitle / image / view / chart(+ChartRenderer)
│   └── external/               button / form(+FormFieldItem) / notes
├── components/
│   ├── AppNavigator.vue        顶部导航（数据源 / 布局 / 动作 / 开发模式 / 发布）
│   ├── AppLeftPanel/           物料抽屉 + 大纲
│   ├── AppPreviewer/           设备模拟器（笔记本框）
│   ├── AppRightPanel/          配置面板（基础 + 专属 + 出码）
│   ├── AppRunnerRenderer/      运行时根（provide editable=false）
│   ├── DataSourceLeftPanel.vue 数据源侧边栏
│   ├── Flow/                   流程编辑器（画布 / 工具栏 / 检查器 / schema）
│   └── SmoothDnd/              smooth-dnd 的 Vue 封装
├── constants/blocksBaseMeta.ts 物料元信息 + 默认数据工厂
├── mocks/blocks.ts             初始块数据
├── stores/                     appEditor / debug
├── types/block.ts              物料协议（可辨识联合）
├── ui/                         SettingField / SegmentedControl
├── utils/array.ts              arrayMove 等工具
├── views/                      AppView / PageLayoutView / DataSourceView / ActionsView / RunnerView
├── setup.ts                    物料注册中心（BlockSuite）
├── main.ts                     应用入口
└── App.vue                     根组件
```

---

## 🏗️ 架构设计

### 物料协议（可辨识联合）

`src/types/block.ts` 用 `type` 字面量组成联合类型，`switch (block.type)` 时自动收窄，写错类型立刻报错：

```ts
interface BaseBlockInfo { id: string; label: string }

interface QuoteBlockInfo extends BaseBlockInfo {
  type: 'quote'
  props: { content: string; status: 'success' | 'warning' | 'error' }
}
// ... heroTitle / image / button / notes / view / chart / form
type BlockInfo = QuoteBlockInfo | HeroTitleInfo | ... | FormBlockInfo
```

当前支持 **8 种物料**：`quote`、`heroTitle`、`image`、`view`、`chart`、`button`、`form`、`notes`。

### 物料注册中心（BlockSuite）

`src/setup.ts` 中创建 `BlockSuite` 实例，注册 8 个物料，通过 **双通道** 暴露：

```ts
app.provide(blocksMapSymbol, blocksMap)
app.config.globalProperties.$blocksMap = blocksMap
```

- 模板里直接用 `$blocksMap[type].material` 渲染
- 脚本里 `inject(blocksMapSymbol)` 获取
- **收益**：加物料不用改渲染器

### 四条数据流

```
① 编排：BlocksDrawer ──drop──► BlockRenderer ──updateBlocks──► store.blocks
② 配置：AppRightPanel ──emit(patch)──► updateBlockProps ──Object.assign──► block.props
③ 渲染：store.blocks ──v-for──► BlockRenderer ──$blocksMap[type].material──► 物料组件
④ 运行：AppRunnerRenderer ──provide('editable', false)──► 所有物料只读
```

**核心原则**：

- 状态只有一份（Pinia `appEditor`），组件之间零通信，都读同一个 store
- 数据变更走「替换 / 原地补丁」，不走「改字段」
- 物料只认 `blockInfo` 一个 prop
- 协议必须可序列化：不存函数、不存组件、不存类实例

### 配置面板（patch 契约）

```ts
// 面板只传补丁
emit('change', { content: '新内容' })
// 外壳 Object.assign 合并
store.updateBlockProps(id, patch)
```

- 面板不持有状态，值全从 `props.blockInfo` 读
- `label`（实例名）与 `props`（内容）走两条通道：`changeLabel` / `change`
- 面板映射用 `Partial<Record<BlockType, Component>>`，key 写错会报错，且允许只实现部分

### 运行时（Runner）

```ts
// AppRunnerRenderer.vue
provide('editable', false)
```

- 物料里 `inject('editable', true)`，编辑器默认 `true`
- 运行态：不显示工具栏、不能拖拽、表单提交才执行
- `provide` 的可能是 `ref`，脚本里用 `unref` 统一处理

---

## 📦 模块说明

### 布局编辑器

`AppLeftPanel`（物料抽屉 + 大纲）+ `AppPreviewer`（笔记本模拟器）+ `AppRightPanel`（配置 + 出码）。

### 数据源

`DataSourceView` 左侧列表 + `DataSourceContent` 详情。详情页通过 `react-dom/client` 的 `createRoot` 把 React 表格组件挂到 Vue 的容器 div 上，卸载时 `root.unmount()`。

### 动作 / 流程

`FlowCanvas` 画布 + `FlowToolbar` 工具栏（新增节点 / 出码）+ `FlowInspector` 节点配置面板。`schema.ts` 的 `exportSchema()` 做白名单转换：

```ts
exportSchema(nodes, edges) → {
  version: '1.0',
  nodes: [{ id, type, label, config, position }],
  edges: [{ id, source, target, type?, label? }]
}
```

`data` 被展平成 `label + config`，且 config 按节点类型白名单过滤（input 只留 source）。

---

## ⚡ 构建与性能

### 分包策略（Vite 8 + Rolldown）

`vite.config.ts` 使用 `build.rolldownOptions.output.codeSplitting`：

```ts
codeSplitting: {
  includeDependenciesRecursively: false,   // 关键：避免把 vue 拖进 echarts 组
  groups: [
    { name: 'vue-common-lib', test: /node_modules[\\/](vue|@vue|vue-router|pinia)[\\/]/, priority: 50 },
    { name: 'vue-flow',       test: /node_modules[\\/]@vue-flow[\\/]/, priority: 40 },
    { name: 'echarts',        test: /node_modules[\\/](echarts|zrender|vue-echarts)[\\/]/, priority: 20 },
    { name: 'validate',       test: /node_modules[\\/]vee-validate[\\/]/, priority: 10 }
  ]
}
```

> Windows 路径用 `[\\/]` 匹配反斜杠；`@vue-flow` 用 `priority` 避免被 `@vue` 规则吞掉。

### 性能优化

| 优化              | 做法                                                                                         | 效果                   |
| ----------------- | -------------------------------------------------------------------------------------------- | ---------------------- |
| 图表异步化        | `ChartBlock` 瘦成壳，echarts 逻辑搬到 `ChartRenderer.vue`，`defineAsyncComponent` 引入 | 首屏 chunk 大幅减小    |
| 包体分析          | `rollup-plugin-visualizer` → `bundle-analysis.html`                                     | 定位体积构成           |
| Flow 节点原地更新 | `n.data = { ...n.data, ...patch }` 代替整数组重建                                          | 改配置只重渲染目标节点 |

**首屏方法论**：首屏 = 入口 chunk + 其静态依赖 chunk。`codeSplitting` 买的是缓存粒度，**动态 `import()` 才能真正降首屏**。
