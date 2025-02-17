<script setup>
import ViewSelector from '../components/ViewSelector.vue'
import imgFlat from '@/assets/img/flat.png'
import img3D from '@/assets/img/3d.png'
import imgMusic from '@/assets/img/music.png'
</script>

<template>
  <div class="flex outer">
    <ViewSelector :bgImage="imgFlat" target="/2d" title="2D" desc="像素画 地图画"></ViewSelector>
    <ViewSelector :bgImage="img3D" target="/3d" title="3D" desc="雕塑"></ViewSelector>
    <ViewSelector :bgImage="imgMusic" target="/music" title="Music" desc="红石音乐"></ViewSelector>
  </div>
</template>

<style lang="less" scoped>
.outer{
  justify-content: space-around;
  align-items: center;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
}
</style>