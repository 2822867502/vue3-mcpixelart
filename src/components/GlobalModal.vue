<script setup>
const props = defineProps(['status'])
const emit = defineEmits(['customClose'])
function close() {
  emit('customClose')
}
</script>
<template>
  <Teleport to="body">
    <div v-if="props.status.visiable" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <h3>{{ props.status.title }}</h3>
        <p v-html="props.status.message"></p>
        <button type="button" class="btn btn-primary" @click="close">确定</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  width: max-content;
  min-width: 30%;
}
button {
  float: right;
}
p {
  letter-spacing: .1rem;
  line-height: 1.5;
}
</style>
