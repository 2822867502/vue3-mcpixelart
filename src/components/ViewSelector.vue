<script setup>
const props = defineProps(['bgImage', 'target', 'title', 'desc'])
</script>

<template>
  <router-link :to="props.target">
    <div class="box borderShade">
      <img :src="props.bgImage">
      <div class="shade">
        <div class="title">{{ props.title }}</div>
        <div class="desc">{{ props.desc }}</div>
      </div>
    </div>
  </router-link>
  
</template>

<style lang="less" scoped>
.box {
  width: 240px;
  height: 50vh;
  border: none;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  padding: 10px;
}
.borderShade {
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.7)
}
img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: transform .3s ease;
}
.shade {
  top: 60%;
  left: 0;
  width: 100%;
  height: 45%;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  position: absolute;
  z-index: 2;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;

  color: rgb(232, 232, 232);
  transition: all .3s ease;
}
.box:hover .shade{
  height: 50%;
  top: 50%;
}
.box:hover img {
  transform: scale(1.1);
}
.title {
  font-size: 36px;
}
.desc {
  font-size: 24px;
}
@media (max-width: 1080px) {
  .box {
    width: 200px;
    height: 40vh;
  }
  .title, .desc {
    font-size: 16px;
  }
}
@media (max-width: 750px) {
  .box {
    width: 160px;
    height: 180px;
  }
  .title, .desc {
    font-size: 16px;
  }
}
</style>