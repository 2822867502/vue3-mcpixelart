<script setup>
import { inject } from 'vue'
const showUserInfo = inject(['userInfo'])
</script>

<template>
  <nav class="flex frow">
    <router-link to="/" class="cell">
      <img src="@/assets/img/logo.png" alt="mcpixelart.com" width="30" height="24">
      <span class="title">Minecraft 艺术</span>
    </router-link>

    <router-link to="/playground" class="cell" style="margin-left: auto;">
      <img src="@/assets/svg/广场.svg" alt="广场" width="28" height="28">
    </router-link>

    <div class="cell user-icon" @click="showUserInfo">
      <img src="@/assets/svg/用户.svg" alt="用户" width="28" height="28">
    </div>
  </nav>
</template>

<style lang="less" scoped>
nav {
  padding: 10px;
  position: fixed;
  width: 100%;
  border-bottom: 2px solid rgb(255, 103, 1);
  // background-color: #1ceff2ad;
  background-color: #712cf9;
  // background: linear-gradient(to bottom, #000000, #000000a3);
  height: 50px;
  z-index: 2;
  top: 0;

  align-items: center;
}
.title {
  text-decoration: none;
}
.cell {
  user-select: none;
  cursor: pointer;
  display: inline-block;
  color: rgb(197, 197, 197);
  margin: 0 20px;
  font-size: 20px;
  transition: color .3s ease;
}
.cell:hover {
  color:rgb(255, 124, 1);
}

.user-icon {
  display: inline-block;
  width: 28px;
  height: 28px;
  background-color: #7a7a7a;
  border-radius: 50%;
  overflow: hidden;
  // margin-left: auto;
  transition: all .2s ease;
  position: relative;
}

.user-icon::before {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 50%;
    border: 2px solid rgb(255, 255, 255);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
}
 
.user-icon:focus::before,
.user-icon:hover::before {
    opacity: 1;
}

@media (max-width: 360px) {
  .title{
    display: none;
  }
}
</style>