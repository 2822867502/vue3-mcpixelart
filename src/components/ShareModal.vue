<script setup>
import { toRefs, inject, watch, ref, computed } from 'vue'
import { apiShare } from '../api/share'
import { downloadFile } from '../utils/autoDownload'
const props = defineProps(['status'])
const { status } = toRefs(props)
const emit = defineEmits(['customClose'])
function close() {
  name.value = ''
  desc.value = ''
  emit('customClose')
}

const globalModal = inject('globalModal')
const waitTask = inject('waitTask')
// 根据类型映射不同的文件url
const roadMap = {
  'art': 'lite',
  'enhance': 'enhance',
  'sculpture': 'scu',
  'music': 'music',
}
const address = ref('')
// 显示模态框时自动下载
watch(status, () => 
{
  if (status.value.visiable && status.value.download) {
    const road = roadMap[status.value.type]
    address.value = `https://mcpixelart.com/${road}/${status.value.fname}`
    downloadFile(address, status.value.fname)
  }
}, {
  deep: true,
  immediate: false,
})

const name = ref('')
const desc = ref('')
function formatStr(str) {
  return str.trim()
}
const nameFmt = computed(() => formatStr(name.value))
const descFmt = computed(() => formatStr(desc.value))

function share() {
  if (nameFmt.value.length === 0) {
    globalModal('提示', '请给作品起个名称吧(20字内)')
    return
  }
  if (nameFmt.value.length >= 20) {
    globalModal('提示', '作品名称太长了(<20)')
    return
  }
  if (descFmt.value.length >= 100) {
    globalModal('提示', '作品描述太长了(<100)')
    return
  }
  const postData = {
    type: status.value.type,
    fname: status.value.fname,
    name: nameFmt.value,
    desc: descFmt.value,
  }
  waitTask(apiShare(postData))
  .then(result => {
    close()
    globalModal('成功', '分享成功')
  })
  .catch(error => {
    globalModal('失败', '分享失败 <br> ' + error)
  })
}
</script>
<template>
  <Teleport to="body">
    <div v-if="status.visiable" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <h3>分享</h3>
        <div v-if="status.download">
          <p>恭喜！制作成功。</p>
          <p>没有自动下载? <a :href="address">点击这里下载</a></p>
          <p>现在您可以决定是否要分享到广场,让更多人看到您的精彩作品</p>
        </div>
        
        <div class="form-floating">
          <input type="text" class="form-control" id="floatingName" v-model="name">
          <label for="floatingName">名称*</label>
        </div>
        <div class="form-floating">
          <input type="text" class="form-control" id="floatingDesc" v-model="desc">
          <label for="floatingDesc">描述</label>
        </div>
        <div class="buttons flex frow">
          <button type="button" class="btn btn-primary" @click="share">一键分享</button>
          <button type="button" class="btn btn-secondary" @click="close">返回</button>
        </div>
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
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  width: max-content;
  min-width: 30%;
}
.buttons {
  justify-content: right;
  gap: 10px;
  margin: 10px 0;
}
p {
  letter-spacing: .1rem;
  line-height: 1.5;
}
</style>
