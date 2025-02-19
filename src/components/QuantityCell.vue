<script setup>
const props = defineProps(['block'])

import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()
const ecMap = blocksStore.ecMap
const offsetMap = blocksStore.offsetMap

import { ref, computed } from 'vue'
const selected = ref(false)
/**将个数转化为 盒+组+个的形式 */
const countDetail = (count) => {
  if (count < 64) return ''
  let num = count
  let group = Math.floor(num / 64)
  let box = Math.floor(group / 27)
  let str = ''
  if (box > 0) {
    str = `${box}盒`
    group -= box * 27
    num -= box * 27 * 64
  }
  if (group > 0) {
    str += `${group}组`
    num -= group * 64
  }
  str += `${num}个`
  return str
}
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
      <span>{{ countDetail(block.count) }}</span>
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