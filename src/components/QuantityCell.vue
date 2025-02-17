<script setup>
const props = defineProps(['block'])

import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()
const ecMap = blocksStore.ecMap
const offsetMap = blocksStore.offsetMap

import { ref } from 'vue'
const selected = ref(false)
</script>

<template>
  <div :class="{cell: true, 'cell-selected': selected, 'cell-unselected': !selected}" @click="selected = !selected">
    <!-- 显示图标和名称 -->
    <div class="flex frow fcen" style="gap: 4px;">
      <div class="colorShow" :style="`background-position: ${offsetMap[block.name]};`"></div>
      <span>{{ ecMap[block.name] }}</span>
    </div>
    <!-- 显示数量 -->
    <span>{{ block.count }}</span>
  </div>
</template>

<style lang="less" scoped>
.colorShow {
  background-image: url('/src/assets/img/BlockCSS.png');
  width: 16px;
  height: 16px;
  display: inline-block;
}
.cell {
  border: 1px solid;
  border-radius: 10px;
  padding: 10px;
  width: max-content;

  display: flex;
  flex-flow: column nowrap;
  gap: 5px;

  transition: border .5s ease;
}
.cell-selected {
  border-color: chartreuse;
}
.cell-unselected {
  border-color: salmon;
}
</style>