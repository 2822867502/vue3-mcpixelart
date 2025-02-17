<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'refresh'])
const opt = ref({
  sort: 'random',
  filter: 'all',
})
watch(opt, () => {
  emit('update:modelValue', opt.value)
}, {
  immediate: true,
  deep: true,
})
function handleSortInput(event) {
  opt.value.sort = event.target.value
  emit('update:modelValue', opt.value)
}
function handleFilterInput(event) {
  opt.value.filter = event.target.value
  emit('update:modelValue', opt.value)
}
</script>

<template>
  <div class="input-group input-group-sm">
    <span class="input-group-text bg-dark text-light">排序</span>
    <select class="form-select bg-dark text-light" :value="opt.sort" @input="handleSortInput">
      <option value="random" selected>随机</option>
      <option value="new">最新发布</option>
      <!-- <option value="hot">最热门</option> -->
    </select>
    <span class="input-group-text bg-dark text-light">筛选</span>
    <select class="form-select bg-dark text-light" :value="opt.filter" @input="handleFilterInput">
      <option value="all" selected>全部</option>
      <option value="art">像素画</option>
      <option value="enhance">强化地图画</option>
      <option value="sculpture">雕塑</option>
      <option value="music">红石音乐</option>
    </select>
    <button class="btn btn-dark" style="border: 1px solid white;" @click="emit('refresh')">刷新</button>
  </div>
</template>

<style lang="less" scoped>
div {
  user-select: none;
}
</style>