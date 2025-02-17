<script setup>
import { toRefs, computed } from 'vue'
import { useUserStore } from '../store/user'
const userStore = useUserStore()
const props = defineProps(['data'])
const { data } = toRefs(props)

const dateStr = computed(() => {
  const date = new Date(data.value.time)
  const utcDate = `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)}`
  const utcTime = `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}`
  return utcDate
})

const typeStyle = computed(() => {
  const classMap = {
    'art': 'text-bg-primary',
    'enhance': 'text-bg-warning',
    'sculpture': 'text-bg-success',
    'music': 'text-bg-danger',
  }
  return ['badge', classMap[data.value.type]]
})
const typeText = computed(() => {
  const classMap = {
    'art': '像素画',
    'enhance': '强化地图画',
    'sculpture': '雕塑',
    'music': '红石音乐',
  }
  return classMap[data.value.type]
})
const downloadAddress = computed(() => {
  const preset = 'https://mcpixelart.com'
  const roadMap = {
    'art': '/lite/',
    'enhance': '/enhance/',
    'sculpture': '/scu/',
    'music': '/music/',
  }
  return preset + roadMap[data.value.type] + data.value.fname
})
const getAuthor = computed(() => {
  const uidMap = userStore.userUidMap
  const author = uidMap.get(data.value.uid)
  return author
})
</script>

<template>
  <div class="play-card flex fcol">
    <!-- <div class="card-img"></div> -->
    <div class="card-info flex fcol"> 
      <span class="card-name">{{ data.name }}</span>
      <span class="card-desc" :title="data.desciption">{{ data.desciption || '该作品暂无简介哟' }}</span>
      <div class="flex frow" style="justify-content: right;">
        <a type="button" class="btn btn-outline-light btn-sm" :href="downloadAddress">下载投影</a>
      </div>
      <div class="flex frow" style="justify-content: space-between;margin-top: auto;">
        <div class="card-left-bottom flex frow">
          <span :class="typeStyle">{{ typeText }}</span>
          <img src="@/assets/svg/制作者.svg">
          <span class="card-author">{{ getAuthor }}</span>
        </div>
        
        <span class="card-date">{{ dateStr }}</span>
      </div>
    </div>
    
  </div>
</template>

<style lang="less" scoped>
.play-card {
  font-family: Arial, sans-serif;
  color: rgb(197, 197, 197);
  background-color: #282c34; /* 深蓝色背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); /* 阴影 */
  border-radius: 8px;
  padding: 5px;
  height: 150px;
  width: 300px;
  user-select: none;
  cursor: pointer;
  transition: all .3s ease;
}
.play-card:hover {
  box-shadow: 0 14px 16px rgba(0, 0, 0, 0.4);
}
.card-img {
  height: 0px;
  flex-grow: 1;
  margin-bottom: 5px;
}
.card-info {
  height: 100%;
  gap: 10px;
}
.card-date {
  color: gray;
}
.card-left-bottom {
  flex-grow: 1;
  gap: 4px;
  margin-bottom: 5px;
}
.card-name {
  font-size: 24px;
}
.card-desc,.card-author {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width:800px) {
  .play-card {
    width: 80%;
  }
}
</style>