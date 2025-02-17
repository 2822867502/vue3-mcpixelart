<script setup>
import PictureBox from '../components/PictureBox.vue'

import SettingModal from '../components/SettingModal.vue'

import artMaker from '../utils/artMaker'
import QuantityStatistics from '../components/QuantityStatistics.vue'

import { useSettingStore } from '../store/setting'
const settingStore = useSettingStore()

import { useProductStore } from "../store/product"
const productStore = useProductStore()

import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()

import { useHistoryStore } from '../store/history'
const historyStore = useHistoryStore()

import { apiEnhance, apiPixelart } from '../api/mc2d'

import imageUtils from '../utils/imageUtils'

import { ref, inject } from 'vue'
const globalModal = inject('globalModal')
const shareModal = inject('shareModal')
const waitTask = inject('waitTask')

/**原图 */
const imgOri = ref(null)
/**结果图 */
const imgRes = ref(null)
/**计数 */
const counter = ref(null)

// 处理文件选择
const handleImageFile = async (event) => {
  const file = event.target.files[0]
  if (file) {
    imgOri.value = await imageUtils.getImageDataFromFile(file)  
  }
}

const makeImage = () => {
  const img = imgOri.value
  const w = settingStore.imgSetting.width
  const h = settingStore.imgSetting.height
  // 放缩图片
  let resizedImg = imageUtils.scaleImageData(img, w, h)
  // 应不应用抖动算法
  if (settingStore.imgSetting.dither) {
    const palette = settingStore.imgSetting.enhance ? settingStore.paletteEnhance : settingStore.palette
    resizedImg = imageUtils.floydSteinbergDither(resizedImg, palette)
  }
  // 结果图和计数器
  let imgR, ct
  // 是不是强化地图画
  if (settingStore.imgSetting.enhance) {
    ({ img: imgR , counter: ct } = artMaker.makeEnhance(resizedImg, w, h))
  } else {
    ({ img: imgR , counter: ct } = artMaker.make(resizedImg, w, h))
  }
  imgRes.value = imgR
  counter.value = ct
}
const handleMake = () => {
  if (!imgOri.value) {
    globalModal('提示', '请先上传图片')
    return
  }
  if (settingStore.selected.length === 0) {
    globalModal('提示', '还未选择方块 <br> 点击 <b> [设置]->[方块] </b> 进行选择')
    return
  }
  if (settingStore.imgSetting.enhance) {
    const w = settingStore.imgSetting.width
    const h = settingStore.imgSetting.height
    if (w > 384 || h > 256) {
      globalModal('提示', '受限于服务器性能,强化地图画不能大于384*256尺寸')
      return
    }
  }
  makeImage()
}
const postPixelArt = () => {
  if (settingStore.imgSetting.enhance) {
    const data = productStore.pixelArtEnhance
    return apiEnhance(data)
  } else {
    const data = {
      art: productStore.pixelArt,
      dir: settingStore.imgSetting.direction.replace('-', ''),
      rot: settingStore.imgSetting.rotate,
    }
    return apiPixelart(data)
  }
}
const handleDownload = () => {
  if (!imgRes.value) {
    globalModal('提示', '请先点击制作')
    return
  }
  const postRequest = postPixelArt()
  waitTask(postRequest)
  .then(({url}) => {
    // 持久化
    historyStore.historyManualAddress === '' && historyStore.setHistoryManualAddress(url.split('.')[0])

    shareModal(settingStore.imgSetting.enhance ? 'enhance' : 'art', url)
  })
  .catch(error => {
    globalModal('失败', error)
  })
}
</script>

<template>
  <SettingModal></SettingModal>
  <div class="box-2d">
    <input type="file" accept="image/*" @change="handleImageFile">
    <!-- 图片显示区 -->
    <div class="flex frow" style="overflow: auto;justify-content: space-between;">
      <div class="pic-box"><PictureBox :imgData="imgOri" name="原图"></PictureBox></div>
      <div class="pic-box"><PictureBox :imgData="imgRes" name="效果图"></PictureBox></div>
    </div>
    <!-- 编辑宽高区 -->
    <div class="input-group">
      <span class="input-group-text bg-dark text-light">宽</span>
      <input type="text" name="w" class="form-control bg-dark text-light" v-model="settingStore.Options.width">
      <span class="input-group-text bg-dark text-light">高</span>
      <input type="text" name="h" class="form-control bg-dark text-light" v-model="settingStore.Options.height">
      <!-- 抖动算法复选框 -->
      <div class="input-group-text bg-dark text-light">
        <input class="form-check-input mt-0 bg-dark text-light" type="checkbox" v-model="settingStore.Options.dither" id="isDither">
        <label for="isDither">抖动算法</label>
      </div>
      <!-- 强化地图画复选框 -->
      <div class="input-group-text bg-dark text-light">
        <input class="form-check-input mt-0 bg-dark text-light" type="checkbox" v-model="settingStore.Options.enhance" id="isEnhance">
        <label for="isEnhance">强化地图画</label>
      </div>
    </div>
    <!-- 按钮组 -->
    <div class="buttons">
      <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#settingModal">
        <img src="/src/assets/svg/设置.svg">
        设置
      </button>
      <button type="button" class="btn btn-primary" @click="handleMake">
        <img src="/src/assets/svg/制作.svg">
        制作
      </button>
      <button type="button" class="btn btn-success" @click="handleDownload">
        <img src="/src/assets/svg/下载.svg">
        下载投影
      </button>
      <router-link to="/manual" type="button" class="btn btn-info">
        <img src="/src/assets/svg/手动.svg">
        手动搭建
      </router-link>
    </div>
    <!-- 显示统计信息 -->
    <div class="counter">
      <QuantityStatistics :counter="counter"></QuantityStatistics>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box-2d {
  background-color: #4f4f4fa7;
  padding: 20px 10px;
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  color: antiquewhite;
  overflow-y: auto;
  user-select: none;

  label {
    margin: 0 4px;
  }
}
input[type="file"] {
  border: dashed 2px rgb(22, 177, 255);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  transition: border .5s ease;
}
input[type="file"]:hover {
  border-color: rgb(90, 208, 0);
}
.pic-box {
  width: 49%;
  height: 300px;
}
.bg-dark {
  border-color: gray;
}
.buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: right;
  gap: 10px;

  button img {
    margin: 0 4px;
  }
}
</style>