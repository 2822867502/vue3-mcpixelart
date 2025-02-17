<script setup>
import { computed, onMounted, ref, watch } from 'vue'
const props = defineProps(['track'])
const emit = defineEmits(['divide'])

import { instrumentNameMap } from '../utils/MIDI'
import MIDITrackInfo from './MIDITrackInfo.vue'
/**25种音色的颜色映射 */
const colorMap = [
  "rgb(0,0,255)",
  "rgb(11,0,244)",
  "rgb(21,0,234)",
  "rgb(32,0,223)",
  "rgb(43,0,213)",
  "rgb(53,0,202)",
  "rgb(64,0,191)",
  "rgb(74,0,181)",
  "rgb(85,0,170)",
  "rgb(96,0,159)",
  "rgb(106,0,149)",
  "rgb(117,0,138)",
  "rgb(128,0,128)",
  "rgb(138,0,117)",
  "rgb(149,0,106)",
  "rgb(159,0,96)",
  "rgb(170,0,85)",
  "rgb(181,0,74)",
  "rgb(191,0,64)",
  "rgb(202,0,53)",
  "rgb(213,0,42)",
  "rgb(223,0,32)",
  "rgb(234,0,21)",
  "rgb(244,0,11)",
  "rgb(255,0,0)"
]

const infoVisiable = ref(false)
function infoHide() {
  infoVisiable.value = false
}

const canvas = ref(null)
const t = computed(() => {
  return props.track.notes.map(note => note.time)
})
const tLen = computed(() => {
  return t.value.length
})
const tDuration = computed(() => {
  if (tLen.value > 0) {
    return tMax.value - tMin.value + props.track.notes[tLen.value - 1].duration
  } else {
    return 0
  }
})
const tMin = computed(() => {
  return Math.min(...t.value)
})
const tMax = computed(() => {
  return Math.max(...t.value)
})
const durationMax = computed(() => {
  return Math.max(...props.track.notes.map(note => note.duration))
})
const paint = () => {
  if(!canvas.value) return
  const dpr = window.devicePixelRatio || 1
  // t轴方向上的绘制放大倍数
  const tScale = 20
  const displayWidth = (tMax.value + durationMax.value) * tScale
  const displayHeight = 100
  canvas.value.style.width = `${displayWidth}px`
  canvas.value.style.height = `${displayHeight}px`
  canvas.value.width = displayWidth * dpr
  canvas.value.height = displayHeight * dpr

  const ctx = canvas.value.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const note of props.track.notes) {
    const color = colorMap[note.pitch]

    ctx.fillStyle = color
    const h = 4
    const x = note.time * tScale
    const y = displayHeight - h * note.pitch
    const w = note.duration * tScale
    ctx.fillRect(x, y, w, h)
  }
}
onMounted(() => {
  paint()
})
watch(props, () => {
  paint()
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div class="flex fcol track-bg">
    <div class="description flex frow">
      <span style="color:hotpink">{{ props.track.name }}</span>
      <span style="color:coral">{{ instrumentNameMap[props.track.name] }}</span>
      <span style="color:chartreuse">t = {{ tDuration.toFixed(2) }} s</span>
      <button class="button1" @click="emit('divide')">拆分音轨</button>
      <button class="button2" @click="infoVisiable = true">查看音轨</button>
    </div>
    <canvas ref="canvas"></canvas>
  </div>
  <MIDITrackInfo :visiable="infoVisiable" :track="props.track" @hide="infoHide"></MIDITrackInfo>
</template>

<style lang="less" scoped>
.track-bg {
  padding: 4px;
  border-radius: 10px;
  background-color: #2bab8fb5;
  width: max-content;
}
.description {
  background-color: #00000000;
  gap: 5px;
  align-items: center;
  border-bottom: 2px dashed #444;
  span {
    color: bisque;
  }
}
canvas {
  height: 100px;
}

button {
  border: none;
  border-radius: 4px;
  height: 32px;
  padding: 4px 8px;
  margin: 4px;
  color: beige;
  transition: all .3s ease;
}

.button1 {
  background-color: #224471;
}
.button1:hover {
  background-color: #3c75c1;
}

.button2 {
  background-color: #712262;
}
.button2:hover {
  background-color: #c63dad;
}
</style>