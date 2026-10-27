# Vue Action

基于 Vue 3 + TypeScript + Vite 的低代码搭建项目，数据源页嵌入了 React 组件（glide-data-grid）。

---

## 踩坑记录

### 1. tsconfig.app.json 中 `baseUrl` 在 TS 6 下废弃

**报错**

```
error TS5101: Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0.
```

**原因**

`typescript ~6.0.3` 已将 `baseUrl` 标记为废弃。TS 4.1+ 之后，`paths` 中的相对路径直接相对于 tsconfig 文件本身解析，不再需要 `baseUrl`。

**修复**

删掉 `tsconfig.app.json` 中的 `"baseUrl": "."` 即可，`@/*` 别名映射不受影响。

---

### 2. 模板内联箭头函数访问 import 绑定触发 vue-tsc 误报

**报错**

```
Property 'value' does not exist on type '{ type: BlockType; label: string; icon: Icon; }[]'. Did you mean 'values'?
```

代码里根本没有 `.value`，是 vue-tsc 生成虚拟代码时错误注入的。

**原因**

当模板内联箭头函数 `(index) => someImportedArray[index].xxx` 里的数组是 `import` 进来的绑定时，vue-tsc 模板编译器会错误地把它当成 `Ref` 去解包（自动加 `.value`）。

**修复**

把回调移到 `<script setup>` 里定义后传引用：

```vue
<script setup>
function getChildPayload(index: number) {
  return getBlocksDefaultData(blocksBaseMetaList[index].type)
}
</script>

<template>
  <SmoothDndContainer :get-child-payload="getChildPayload" />
</template>
```

---

### 3. Vue 项目嵌入 React 组件的渲染崩溃

**报错**

浏览器控制台：

```
Objects are not valid as a React child (found: object with keys {__v_isVNode, ...})
```

Vite dev server 同时出现：

```
vue/jsx-dev-runtime.js net::ERR_ABORTED
dependency optimized: vue/jsx-dev-runtime
```

**根因链**

这是多个因素叠加导致的，缺一不可：

1. **`@vue/tsconfig` 继承链硬编码 `jsxImportSource: "vue"`**

   `node_modules/@vue/tsconfig/tsconfig.json` 里有：

   ```json
   "jsx": "preserve",
   "jsxImportSource": "vue"
   ```

   虽然项目覆盖了 `"jsx": "preserve"`，但**`jsxImportSource` 没覆盖**。Vite 扫描到 `.tsx` 文件后看到这个配置，就预构建了 `vue/jsx-dev-runtime`。
2. **React JSX 被 Vue JSX runtime 包装**

   ReactDataSource.tsx 被 Vue 的 JSX runtime 转译，产出带 `__v_isVNode` 标记的对象。
3. **React 遇到不是 ReactElement 的对象直接崩溃**

   React 在渲染时遇到这个"非法 child"，抛出 `Objects are not valid as a React child`。
4. **额外坑：React 19 与 glide-data-grid 6.x 不兼容**

   `@glideapps/glide-data-grid@6.0.3` 的 peerDependencies 只支持 `react ^16.12.0 || 17.x || 18.x`，装成 React 19 会引发运行时兼容问题。

**完整修复清单**

| 步骤                           | 改动                                                                                                                                       | 作用                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 装依赖                         | `pnpm add react@18 react-dom@18 @glideapps/glide-data-grid` + `pnpm add -D @types/react@18 @types/react-dom@18 @vitejs/plugin-react@4` | 满足 peerDep                                                                   |
| **覆盖 jsxImportSource** | `tsconfig.app.json` 加 `"jsxImportSource": "react"`                                                                                    | **核心修复**：告诉 Vite + TS 用 React JSX runtime                        |
| tsconfig 加 JSX 支持           | `"allowJs": true`、include 加 `*.js *.jsx`                                                                                             | 让 TS 能识别 JS/JSX 文件                                                       |
| `.jsx` → `.tsx`           | 把 ReactDataSource.jsx 改名 + 加类型                                                                                                       | 明确 React 边界，有 IDE 提示                                                   |
| 文件顶部加 `// @ts-nocheck`  | ReactDataSource.tsx 第一行                                                                                                                 | vue-tsc 对 React JSX 类型有天然冲突（VNode vs ReactElement），让它跳过这个文件 |

**vite.config.ts 最终形态**

```ts
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  // react() 放在 vue() 前面，确保 .tsx 先被正确识别为 React JSX
  plugins: [react(), vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    // 防御性排除，避免 Vite 误预构建 Vue JSX runtime
    exclude: ['vue/jsx-dev-runtime', 'vue/jsx-runtime']
  }
})
```

**VueDevTools 可以保留**——修复 `jsxImportSource` 后它不会再干扰 React 模块。

---

### 4. 混嵌架构的类型隔离问题

**现象**

即使修复了运行时问题，`vue-tsc` 仍会报 ReactDataSource.tsx 的类型错误，比如 `VNodeRef` 不能赋给 `RefObject<HTMLDivElement>`、`DataEditor` 不能用作 JSX 组件。

**原因**

vue-tsc 在处理 `.tsx` 时会混入 Vue 的 JSX 类型定义（因为项目整体还是 Vue 配置），和 React 的 JSX 类型产生冲突。

**处理方式**

- React 文件顶部加 `// @ts-nocheck`，只让 `@vitejs/plugin-react` 处理该 `.tsx` 文件的转译
- 如果想更干净，可以把 React 逻辑抽到独立的 Vite 子工程或用 `unplugin-vue-jsx` 单独配置
