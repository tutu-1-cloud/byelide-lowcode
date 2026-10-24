<template>
  <div class="layout-wrapper">
    <aside class="layout-left"><div class="placeholder">左侧物料面板</div></aside>
    <section class="layout-center"><div class="placeholder">画布区</div></section>
    <aside class="layout-right"><div class="placeholder">右侧配置面板</div></aside>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
}

.layout-left {
  flex-shrink: 0;
  width: 320px;
  border-right: 1px solid var(--color-gray-300);
  background-color: var(--color-gray-100);
}

.layout-center {
  flex: 1;
  min-width: 0;
  overflow: auto;
  background-color: var(--color-white);
}

.layout-right {
  flex-shrink: 0;
  width: var(--panel-width);
  border-left: 1px solid var(--color-gray-300);
  background-color: var(--color-gray-100);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-gray-600);
  font-size: var(--font-size-normal);
}
</style>