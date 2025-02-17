<script setup>
const props = defineProps(['status'])
const emit = defineEmits(['customClose'])
function close() {
  emit('customClose')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="props.status.visiable" class="modal-overlay">
      <div class="modal-content">
        <!-- <h3>{{ props.status.title }}</h3>
        <p>{{ props.status.message }}</p> -->
        <div class="flex frow" style="align-items: center;gap: 10px;">
          <img src="../assets/img/logo.png" alt="Bootstrap" width="30" height="24">
          <h3>Minecraft 像素艺术</h3>
        </div>
        <hr>
        <div class="flex frow" style="justify-content: space-between;gap: 10px;">
          <div class="loader"></div>
          <p style="flex-grow: 1;">
            加载中...请您耐心等待 <br>
            作品越大，制作所需的时间越长
          </p>
        </div>

        <hr>
        <button type="button" class="btn btn-danger" @click="close">终止</button>
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
  z-index: 9999;
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

.loader {
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #3498db;
  width: 48px;
  height: 48px;
  animation: spin 2s ease infinite;
  float: left;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
