<script setup>
import imageUtils from '../utils/imageUtils'
import { ref, watch, computed, nextTick } from "vue"
const canvas = ref(null)
const props = defineProps(['imgData', 'visiable'])
const emit= defineEmits(['close'])

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

const imageSize = computed(() => {
  if (!props.imgData) return {height: 0, width: 0}
  return {
    height: props.imgData.height || 0,
    width: props.imgData.width || 0,
  }
})

const resizedImageData = computed(() => {
  if (props.imgData && imageSize.value.height * imageSize.value.width > 0) {
    const ratioW =  canvasSize.value.width / imageSize.value.width
    const ratioH = canvasSize.value.height / imageSize.value.height
    const dpr = window.devicePixelRatio || 1
    const ratio = Math.min(ratioW, ratioH) * dpr
    if (ratio > 0) {
      const resized = imageUtils.scaleImageData(props.imgData, ratio)
      return resized
    }
  } else {
    return props.imgData
  }
  
})

function paint() {
  if(props.imgData && canvas.value && props.visiable) {
    const ctx = canvas.value.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.value.height = canvasSize.value.height * dpr
    canvas.value.width = canvasSize.value.width * dpr
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.putImageData(resizedImageData.value, 0, 0)
  }
}

watch(() => [props.imgData, props.visiable], () => {
  nextTick(paint)
}, {
  immediate: true
})
</script>

<template>
  <Teleport to="body">
    <div class="image-container flex fcen" ref="imageContainer" @click="emit('close')" v-if="visiable">
      <canvas ref="canvas"></canvas>
    </div>
  </Teleport>
</template>

<style scoped>
.image-container {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  background-color: #00000085;
}

canvas {
  width: 90%;
  height: 90%;
}
</style>