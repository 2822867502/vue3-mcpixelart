<script setup>
import QuantityCell from './QuantityCell.vue'
const props = defineProps(['counter'])
</script>

<template>
  <div class="container">
    <QuantityCell v-for="block in counter" :key="`counter-${block.name}-${block.count}`" :block="block"></QuantityCell>
  </div>
  
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-flow: row wrap;
  gap: 5px;
}
</style>