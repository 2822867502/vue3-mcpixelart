<script setup>
import { ref, toRefs, computed, watch, shallowRef, inject } from 'vue'
import { useUserStore } from '../store/user'
import { apiPlaygroundLoad, pretreat, apiPlaygroundLike, apiPlaygroundDislike } from '../api/playground'
import imageUtils from '../utils/imageUtils'
import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()
const userStore = useUserStore()
const props = defineProps(['data'])
const { data } = toRefs(props)
const globalModal = inject('globalModal')
const waitTask = inject('waitTask')

/**作品创建日期 */
const dateStr = computed(() => {
  const date = new Date(data.value.time)
  const utcDate = `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)}`
  const utcTime = `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}`
  return utcDate
})
/**根据作品类型分配不同样式 */
const typeStyle = computed(() => {
  const classMap = {
    'art': 'text-bg-primary',
    'enhance': 'text-bg-warning',
    'sculpture': 'text-bg-success',
    'music': 'text-bg-danger',
  }
  return ['badge', classMap[data.value.type]]
})
/**类型信息 */
const typeText = computed(() => {
  const classMap = {
    'art': '像素画',
    'enhance': '强化地图画',
    'sculpture': '雕塑',
    'music': '红石音乐',
  }
  return classMap[data.value.type]
})
/**文件下载地址 */
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
/**得到作者信息 */
const getAuthor = computed(() => {
  const uidMap = userStore.userUidMap
  const author = uidMap.get(data.value.uid)
  return author
})
/**能否显示预览图 当type为art/enhance时为true */
const canPreview = computed(() => ['art', 'enhance'].includes(data.value.type))
/**预览图 */
const previewSize = ref({
  width: 0,
  height: 0
})
/**实际面积 */
const area = computed(() => previewSize.value.width * previewSize.value.height)
/**实际面积如果超过一定尺寸就不自动加载 */
const isSizeOver = computed(() => {
  const MAX_AREA = 384 * 256
  // 如果area是NaN、undefined、0都视为超出尺寸
  return area.value > MAX_AREA || !area.value
})
/**用户是否强制加载预览图 */
const userForcePreview = ref(false)
/**是否加载预览图，如果不超过一定尺寸则自动加载，否则需要用户点击图片手动加载 */
const showPreview = computed(() => userForcePreview.value || !isSizeOver.value)
/**图片像素矩阵 */
const matrix = shallowRef([])
/**预览图url */
const preview = ref('')
/**父组件传data时获取原文件并进行预处理 得到图像矩阵和尺寸信息 */
watch(data, () => {
  if (canPreview.value) {
    apiPlaygroundLoad(`/${data.value.type}/${data.value.fname}`)
    .then(obj => {
      const pre = pretreat(data.value.type, obj)
      matrix.value = pre.matrix
      previewSize.value.height = pre.h
      previewSize.value.width = pre.w
    })
  }
}, {
  deep: true,
  immediate: true
})
/**当可以展示该预览图时 从数组重建图片 */
watch(showPreview, () => {
  if (showPreview.value && matrix.value.length > 0) {
    imageUtils.rebuildImage(blocksStore.xyMap,matrix.value)
    .then(imgURL => {
      preview.value = imgURL
    })
  }
}, {
  immediate: true
})

function handleLike(id) {
  waitTask(apiPlaygroundLike(id))
  .then(r => {
    globalModal('成功', r)
  })
  .catch(err => {
    globalModal('失败', '点赞失败 <br> ' + err)
  })
}

function handleDislike(id) {
  waitTask(apiPlaygroundDislike(id))
  .then(r => {
    globalModal('成功', r)
  })
  .catch(err => {
    globalModal('失败', '点踩失败 <br> ' + err)
  })
}
</script>

<template>
  <div class="play-card flex fcol">
    <!-- <div class="card-img"></div> -->
    <div class="card-info flex fcol"> 
      <span class="card-name">{{ data.name }}</span>
      <span class="card-desc" :title="data.desciption">{{ data.desciption || '该作品暂无简介哟' }}</span>
      <div class="flex fcen" v-if="preview">
        <img alt="预览" :src="preview" :style="`height: 256px;width: 256px;`">
      </div>
      <div v-if="canPreview && !preview" class="flex fcen preview-placeholder" @click="userForcePreview = true">单击显示预览图<br>请耐心等待加载</div>
      <div class="flex frow" style="justify-content: space-between;">
        <div><span v-if="area > 0" class="badge text-bg-secondary">{{ previewSize.width }} * {{ previewSize.height }}</span></div>
        <a type="button" class="btn btn-outline-light btn-sm" :href="downloadAddress">下载投影</a>
      </div>
      <div class="flex frow" style="gap: 10px;">
        <button type="button" class="btn btn-outline-info btn-sm" title="点赞" @click="handleLike(data.id)">
          <img src="/src/assets/svg/点赞.svg" alt="点赞" height="24" width="24">
          {{ data.hot }}
        </button>
        <button type="button" class="btn btn-outline-info btn-sm" title="点踩" @click="handleDislike(data.id)">
          <img src="/src/assets/svg/点踩.svg" alt="点踩" height="24" width="24">
        </button>
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
  // height: 150px;
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

.preview-placeholder { 
  width: 100%;
  height: 256px;
  background-color: #333;
  color: #bbb;
}
@media (max-width:800px) {
  .play-card {
    width: 90%;
  }
}
</style>