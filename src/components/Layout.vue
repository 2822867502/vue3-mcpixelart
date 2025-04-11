<script setup>
import NavBar from './NavBar.vue'
import FootBar from './FootBar.vue'
import { ref, onMounted } from 'vue'
import bgPurpose from '../assets/img/bg_purpose.png'
import bgBlue from '../assets/img/bg_blue.png'
import bgGray from '../assets/img/bg_gray.png'
import bgLightGray from '../assets/img/bg_lightgray.png'

const bgStyle = ref()
const bgImages = [bgPurpose, bgBlue, bgGray, bgLightGray]
onMounted(() => {
  // 随机选择一张背景图
  const randomImg = bgImages[Math.floor(Math.random() * bgImages.length)]
  bgStyle.value = {
    backgroundImage: `url(${randomImg})`,
  }
})
</script>

<template>
  <NavBar></NavBar>
  <main>
    <div class="bgc" :style="bgStyle"></div>
    <div class="content">
      <slot></slot>
    </div>
  </main>
  <FootBar></FootBar>
</template>

<style lang="less" scoped>
@keyframes slide {
  0% {
    transform: translate(-160px,-160px);
  }
  100% {
    transform: translate(160px,160px);
  }
}
main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

main .bgc {
  position: absolute;
  top: -160px;
  left: -160px;
  width: calc(100% + 320px);
  height: calc(100% + 320px);
  animation: slide 30s linear infinite;
  z-index: -1;
}

.content {
  width: 70%;
  height: calc(100% - 50px - 36px);
  // background-color: #6b6b6b7c;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50px);
  overflow-y: auto;
}

@media (max-width: 800px) {
  .content {
    width: 100%;
  }
}
</style>