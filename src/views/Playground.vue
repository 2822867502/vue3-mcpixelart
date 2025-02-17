<script setup>
import { computed, onActivated, ref } from 'vue'
const opt = ref({
  sort: 'random',
  filter: 'all',
})
const data = ref([])
const data12 = computed(() => {
  const p = currentPage.value - 1
  return data.value.slice(p * 12,p * 12 + 12)
})
import ContentSelector from '../components/ContentSelector.vue'
import Pagination from '../components/Pagination.vue'
import PlayCard from '../components/PlayCard.vue'
import { apiFeed } from '../api/share'
import { useUserStore } from '../store/user'
const userStore = useUserStore()
/**加载数据 */
function loadData() {
  apiFeed(opt.value)
  .then(v => {
    userStore.cache(v)
    data.value = v
  })
  .catch(r => {
    console.error('内容加载失败',r)
  })
}
/**当前页数 */
const currentPage = ref(1)
function handlePageChange(page) {
  currentPage.value = page
}

onActivated(() => {
  loadData()
})
</script>

<template>
  <div class="outer flex fcol">
    <ContentSelector v-model="opt" @refresh="loadData"></ContentSelector>
    <div class="content flex">
      <PlayCard v-for="card in data12" :key="`card-${card.id}`" :data="card"></PlayCard>
    </div>
    <Pagination :data="data" @change="handlePageChange"></Pagination>
  </div>
</template>

<style lang="less" scoped>
.outer {
  background-color: #4f4f4fa7;
  padding: 20px 10px 0 10px;
  width: 100%;
  height: 100%;
  overflow: none;
}
.content {
  flex-grow: 1;
  flex-flow: row wrap;
  overflow-y: auto;
  margin: 10px 0;
  justify-content: space-around;
  gap: 10px;
}
@media (max-width:800px) {
  .content {
    flex-flow: column nowrap;
    justify-content: default;
    align-items: center;
  }
}
</style>