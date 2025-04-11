<script setup>
import { computed, toRefs, ref, watch } from 'vue'
const emit = defineEmits(['change'])
const props = defineProps(['data'])
const { data } = toRefs(props)
// 总数据量
const n = computed(() => data.value.length)
// 当前页
const currentPage = ref(1)
watch(currentPage, () => {
  emit('change', currentPage.value)
}, {
  immediate: true,
})
// 分页按钮最大数量 必须是奇数 大于等于5
const BTN_NUM = 5
// 每页最多个数
const PAGE_NUM_MAX = 12
// 省略号
const OMIT = '...'
const totalPages = computed(() => Math.ceil(n.value / PAGE_NUM_MAX))
const displayedPages = computed(() => {
  let pages = []

  // 如果页数超过BTN_NUM，才需要分页显示省略号
  if (totalPages.value > BTN_NUM) {
    const left = Math.max(1, currentPage.value - Math.floor(BTN_NUM / 2))
    const right = Math.min(totalPages.value, currentPage.value + Math.floor(BTN_NUM / 2))

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push(OMIT)
    }

    for (let i = left; i <= right; i++) {
      pages.push(i)
    }

    if (right < totalPages.value) {
      if (right < totalPages.value - 1) pages.push(OMIT)
      pages.push(totalPages.value)
    }
  } else {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  }

  return pages
})

function gotoPage(i) {
  const page = parseInt(i)
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(data, () => {
  // 每次刷新数据后回到第一页
  gotoPage(1)
  // if (currentPage.value > totalPages.value) {
  //   gotoPage(1)
  // }
},{
  deep: true,
  immediate: false,
})

</script>

<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" @click="gotoPage(currentPage - 1)"><span class="page-link">&lt;-</span></li>
      <li 
        v-for="(page,pageIndex) in displayedPages" 
        :key="`page-${page}-${pageIndex}`"
        :class="{'page-item':true, 'active': currentPage === page, 'disabled': page === OMIT}" 
        @click="page !== OMIT && gotoPage(page)"
      >
        <span class="page-link">{{ page }}</span>
      </li>
      <li class="page-item" @click="gotoPage(currentPage + 1)"><span class="page-link">-&gt;</span></li>
    </ul>
  </nav>
</template>

<style lang="less" scoped>
li {
  user-select: none;
  cursor: pointer;
}
</style>