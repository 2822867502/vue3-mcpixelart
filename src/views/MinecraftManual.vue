<script setup>
import { computed, ref, inject, watch, onMounted, onActivated } from 'vue'
import { useHistoryStore } from '../store/history'
import ImageCropper from '../components/ImageCropper.vue'

import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()

import imageUtils from '../utils/imageUtils'
const historyStore = useHistoryStore()
onActivated(() => {
  iptUrl.value = historyStore.historyManualAddress
})

// 图片二维数组 元素是方块名
const image = ref([])
const imageH = computed(() => image.value.length || 0)
const imageW = computed(() => image.value[0]?.length || 0)
// 图片的url
const imageSrc = ref('')
// 绑定用户输入url
const iptUrl = ref('')
// 当前行数 based 0
const line = ref(0)
// 绑定用户输入line based 1
const iptLine = ref('1')
// 确保line是有效的数字
watch(iptLine, () => {
  const num = parseInt(iptLine.value)
  if (num > 0 && num <= imageH.value) {
    line.value = num - 1
  } else {
    line.value = 0
  }
})
const changeLine = (delta) => {
  if (delta > 0 && line.value >= imageH.value - 1) return
  if (delta < 0 && line.value <= 0) return
  iptLine.value = (line.value + 1 + delta).toString()
}

// 每行显示的方块数
const numPerLine = ref('16')
const npl = computed(() => parseInt(numPerLine.value))
const oneLine = computed(() => {
  const res = []
  const flatArray = image.value[line.value]
  if (!flatArray) return []
  let i = 0
  while (i < flatArray.length) {
    res.push(flatArray.slice(i, i + npl.value))
    i += npl.value
  }
  return res
})
// 显示选中的方块信息
const selectedBlock = ref({
  name: '',
  row: 0,
  col: 0,
  index: 0,
})

import { apiReload } from '../api/mcManual'

const globalModal = inject('globalModal')
const waitTask = inject('waitTask')

/**补足位数 */
const compleDigit = (max, value) => {
  const maxLength = max.toString().length
  const formattedValue = value.toString().padStart(maxLength, '0')
  return formattedValue
}

//检查输入的Url合法性 格式化输出文件地址、搜索框样式
const UrlValid = computed( () => {
  //识别形如 https://mcpixelart.com/lite/9937-1ae5bdae0b8b.litematic 可以忽略域名、扩展名
  // 1730032686651c8f5f24f-941e-4a8b-85fe-b6a82878415a
  const reg1 = /lite\/(?<fname>[0-9a-zA-Z-]+)\.?/
  //识别形如 9937-1ae5bdae0b8b.litematic
  const reg2 = /^(?<fname>[0-9a-zA-Z-]+)\.?/
  //识别形如 9937-1ae5bdae0b8b
  const reg3 = /(?<fname>[0-9a-zA-Z-]+)$/
  
  const mt = iptUrl.value.match(reg1) || iptUrl.value.match(reg2) || iptUrl.value.match(reg3)
  if (mt) {
    const fname = mt.groups.fname
    return {
      valid: 'is-valid',
      fname,
    }
  } else {
    if (iptUrl.value.trim() === '') {
      //空内容
      return {
        valid: '',
      }
    } else {
      //非法内容
      return {
        valid: 'is-invalid',
      }
    }
  }
})

const submit = () => {
  const fname = UrlValid.value.fname
  if (fname) {
    waitTask(apiReload({ fname }))
    .then(({image: img}) => {
      image.value = img
      imageUtils.rebuildImage(img)
      .then(url => {
        // reload成功
        imageSrc.value = url
        // 将地址存入history持久化
        historyStore.historyManualAddress = fname
      })
      .catch(err => globalModal('失败', err))
    })
    .catch(err => globalModal('失败', err))
  } else {
    globalModal('失败', '请检查输入链接是否正确 <br> 提示:制作像素画时<b style="color: red;">不能</b>勾选强化地图画')
  }
}
</script>

<template>
  <div class="outer">
    <div class="enhance-alert">
      如果要使用手动搭建，制作时就不能选择 <span class="emphasize">[强化地图画]</span>
    </div>
    <!-- 链接输入 -->
    <form class="d-flex" role="search" style="flex-grow: 1;">
      <input 
        :class="['form-control', 'me-2', UrlValid.valid]" 
        style="flex-grow: 1;" 
        type="search" 
        placeholder="请输入像素画链接" 
        aria-label="Search" 
        v-model="iptUrl" 
        required
      >
      <button 
        class="btn btn-success" 
        type="submit" 
        style="white-space: nowrap;" 
        @click.prevent="submit"
      >
      打开
      </button>
    </form>
    <!-- 图片操作 -->
    <ImageCropper 
      class="image-cropper"
      :imageSrc="imageSrc"
      :current="imageH > 0 ? line / imageH : 0"
    />
    <!-- 用户操作区 -->
    <div class="flex fcol" style="color: bisque;gap: 5px;">
      <div class="input-group input-group-sm mb-3" >
        <label class="input-group-text" for="nplInput">当前行数:</label>
        <button class="btn btn-sm btn-info" @click="changeLine(-1)">-</button>
        <input class="form-control" type="text" id="nplInput" v-model="iptLine">
        <button class="btn btn-sm btn-info" @click="changeLine(1)">+</button>
        <label class="input-group-text" for="nplNum">每行个数:</label>
        <input class="form-control" type="text" id="nplNum" v-model="numPerLine">
      </div>
    </div>
    <!-- 显示选中的方块信息 -->
    <div style="color:chartreuse;">
      <b style="color:aqua">{{ selectedBlock.name }}</b>
      
      第 {{ selectedBlock.row }} 行 第 {{ selectedBlock.col }} 列
      第 {{ selectedBlock.index }} 个
      <span style="color:coral">图片尺寸 {{ `${imageW}*${imageH}` }}</span>
    </div>
    <!-- 显示一整行的方块 -->
    <div>
      <div class="gap-col" v-for="(blocksLine, blIndex) in oneLine" :key="`bl${blIndex}`" style="color:bisque">
        {{ compleDigit(imageW, npl * blIndex + 1) }}
        <div
          v-for = "(block, bIndex) in blocksLine" :key="`bl${blIndex}b${bIndex}`"
          class="cell gap-row"
          :style="`background-position: -${(block === 'air' ? 47 : blocksStore.xyMap[block][0]) * 32}px -${(block === 'air' ? 47 : blocksStore.xyMap[block][1]) * 32}px;`"
          @click="selectedBlock = {name: (block === 'air' ? '无' : blocksStore.ecMap[block]), row: blIndex + 1, col: bIndex + 1, index: blIndex * npl + bIndex + 1}"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.outer {
  background-color: #00000080;
  padding: 5px;
}
.enhance-alert {
  width: 100%;
  padding: 5px;
  background-color: rgb(3, 40, 48);
  border-left: 4px solid rgb(8, 121, 144);
  color: rgb(110, 223, 246);
  margin: 10px 0;
  .emphasize {
    color: rgb(230, 133, 181)
  }
}
.image-cropper {
  margin: 10px 0;
}
.cell {
  background-color: #ffffff00;
  background-image: url('/src/assets/img/BlockCSS2.png');
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: inline-block;
  border: 1px dotted green;
}

// 每八个为一组
.gap-row:not(:nth-child(8n)) {
  margin-right: 4px;
}
.gap-row:nth-child(8n) {
  margin-right: 12px;
}
.gap-row:last-child {
  margin-right: 0;
}

.gap-col:not(:nth-child(8n)) {
  margin-bottom: 4px;
}
.gap-col:nth-child(8n) {
  margin-bottom: 12px;
}
.gap-col:last-child {
  margin-bottom: 0;
}

.ruler {
  display: inline-block;
  width: 64px;
  height: 32px;
}
</style>