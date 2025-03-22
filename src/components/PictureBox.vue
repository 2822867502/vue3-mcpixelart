<script setup>
import { onUnmounted, watch, computed, ref } from 'vue'
import imageUtils from '../utils/imageUtils'
import ImagePreview from './ImagePreview.vue'
const canvas = ref(null)
const props = defineProps(['imgData', 'name'])

// 展示预览图
const showPreview = ref(false)

const resizedImageData = computed(() => {
  if (props.imgData && imageSize.value.height * imageSize.value.width > 0) {
    // 确保 1.传入了图片 2.图片宽高不为0
    const ratioW =  canvasSize.value.width / imageSize.value.width
    const ratioH = canvasSize.value.height / imageSize.value.height
    const dpr = window.devicePixelRatio || 1
    const ratio = Math.min(ratioW, ratioH) * dpr
    if (ratio < 1 && ratio > 0) {
      // 如果图片尺寸超过canvas尺寸则返回缩小后的图
      const resized = imageUtils.scaleImageData(props.imgData, ratio)
      return resized
    } else {
      return props.imgData
    }
  } else {
    // 如果图片尺寸不超过canvas尺寸/发生意外则返回原图
    return props.imgData
  }
  
})

const imageSize = computed(() => {
  if (!props.imgData) return {height: 0, width: 0}
  return {
    height: props.imgData.height || 0,
    width: props.imgData.width || 0,
  }
})

const imageRSize = computed(() => {
  if (!props.imgData) return {height: 0, width: 0}
  return {
    height: resizedImageData.value.height || 0,
    width: resizedImageData.value.width || 0,
  }
})

const canvasSize = computed(() => {
  const rect = canvas.value?.getBoundingClientRect()
  if (rect) {
    return {
      height: rect.height,
      width: rect.width
    }
  } else {
    return {
      height: 0,
      width: 0
    }
  }
})

onUnmounted(() => {
  paint()
})

watch(() => props.imgData, () => {
  paint()
})

function paint() {
  if(props.imgData && canvas.value) {
    const ctx = canvas.value.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.value.height = canvasSize.value.height * dpr
    canvas.value.width = canvasSize.value.width * dpr
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.putImageData(resizedImageData.value, 0, 0)
  }
}
</script>

<template>
  <div class="pic flex fcol">
    <canvas ref="canvas" @click="showPreview=true"></canvas>
    <div class="flex fcen">
      {{ props.name }} - {{ `${imageSize.width}*${imageSize.height}` }}
    </div>
  </div>
  <ImagePreview :imgData="imgData" :visiable="showPreview" @close="showPreview=false"></ImagePreview>
</template>

<style lang="less" scoped>
.pic {
  border: 2px dashed rgb(22, 177, 255);
  transition: border .5s ease;
  border-radius: 10px;
  padding: 10px;
  height: 100%;
}
.pic:hover {
  border: 2px dashed rgb(90, 208, 0);
}
canvas {
  flex-grow: 1;
  cursor: zoom-in;
}
</style>