<script setup>
import { computed } from 'vue'
import { instrumentNameMap, instrumentBlockMap, makeTrack } from '../utils/MIDI'

const props = defineProps(['visiable', 'track'])
const emit = defineEmits(['hide'])
const info = computed(() => {
  return `${props.track.name} - ${instrumentNameMap[props.track.name]} - ${instrumentBlockMap[props.track.name]}`
})
const content = computed(() => {
  let str = ''
  const made = makeTrack(props.track)
  str = made.arr.map((v,i)=> {
    return `t=${(i*0.1).toFixed(1)} ${v.play ? '音高=' + v.pitch : '无'}`
  }).join('\n')
  return str
})

function saveAsImage() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  ctx.font = '16px Arial'
  const text = info.value + '\n' + content.value
  const lines = text.split('\n')

  // 计算最大宽度和总高度
  let maxWidth = 0;
  let totalHeight = 0

  lines.forEach(line => {
    const lineWidth = ctx.measureText(line).width
    if (lineWidth > maxWidth) {
      maxWidth = lineWidth
    }
    totalHeight += 16
  })

  const padding = 10
  canvas.width = maxWidth + padding * 2
  canvas.height = totalHeight + padding * 2

  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#000'
  ctx.textBaseline = 'top'
  let y = padding;
  lines.forEach(line => {
    ctx.fillText(line, padding, y)
    y += 16
  })

  const dataURL = canvas.toDataURL('image/png');
 
  // 创建一个临时的 <a> 元素用于下载
  const link = document.createElement('a')
  link.href = dataURL
  link.download = 'track.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="props.visiable" class="mask flex frow fcen" @click="emit('hide')">
      <div class="box flex fcol" @click.stop>
        <div class="head flex frow">
          <h3>音轨 </h3>
          <button type="button" class="btn btn-outline-dark" @click="emit('hide')">X</button>
        </div>
        <span>{{ info }}</span>
        <button class="btn btn-success" @click="saveAsImage">保存为截图</button>
        <div class="content">
          <pre>{{ content }}</pre>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
.mask {
  position: absolute;
  background-color: #0000008a;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 99;
}
.box {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  min-width: 50%;
  min-height: 40%;
  max-width: 80%;
  max-height: 80%;
}
.head {
  justify-content: space-between;
  align-items: center;
}
.content {
  overflow: auto;
}
</style>