<script setup>
import { toRefs, inject, watch, ref, computed } from 'vue'
import { useUserStore } from '../store/user'
import { apiChangeName, apiGetHistory } from '../api/user'
import { apiShare } from '../api/share'
const userStore = useUserStore()
const props = defineProps(['status'])
const { status } = toRefs(props)
const emit = defineEmits(['customClose'])
function close() {
  emit('customClose')
}

const globalModal = inject('globalModal')
const waitTask = inject('waitTask')
const shareModal = inject('shareModal')

const uname = ref('')
const works = ref([])
// 格式化时间 yyyy-mm-dd hh:mm:ss
const dateTimeStr = (datetime) => {
  const date = new Date(datetime)
  const utcDate = `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)}`
  const utcTime = `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}`
  return utcDate + ' ' + utcTime
}

const typeStyle = computed(() => {
  const classMap = {
    'art': 'text-bg-primary',
    'enhance': 'text-bg-warning',
    'sculpture': 'text-bg-success',
    'music': 'text-bg-danger',
  }
  return ['badge', classMap[works.value.type]]
})
const typeText = (type) => {
  const classMap = {
    'art': '像素画',
    'enhance': '强化地图画',
    'sculpture': '雕塑',
    'music': '红石音乐',
  }
  return classMap[type]
}
const downloadAddress = (type, fname) => {
  const preset = 'https://mcpixelart.com'
  const roadMap = {
    'art': '/lite/',
    'enhance': '/enhance/',
    'sculpture': '/scu/',
    'music': '/music/',
  }
  return preset + roadMap[type] + fname
}
// 格式化后的数据
const worksFormatted = computed(() => {
  return works.value.map(work => ({
    fname: work.fname,
    name: work.name,
    share: work.share === 1,
    type: typeText(work.type),
    time: dateTimeStr(work.time),
    address: downloadAddress(work.type, work.fname)
  }))
})
// 每次打开模态框获取最新数据
watch(status, () => {
  if (status.value.visiable) {
    uname.value = userStore.uname
    apiGetHistory()
    .then(v => {
      works.value = v
    })
  }
},
{
  deep: true,
})
// 发请求改名
function changeName() {
  waitTask(apiChangeName({name : uname.value}))
  .then(v => {
    userStore.changeName(uname.value)
    globalModal('成功', '昵称更改成功')
  })
  .catch(r => {
    globalModal('失败', '昵称更改失败 <br> ' + r)
  })
}

function handleShare(fname, type, ashare) {
  if (ashare) {
    // 分享
    shareModal(type, fname, false)
  } else {
    // 取消分享
    waitTask(apiShare({
      fname,
      name : '',
      desc: '',
      share: false,
    }))
    .then(v => {
      globalModal('成功', '更改成功')
    })
    .catch(r => {
      globalModal('失败', '更改失败 <br> ' + r)
    })
  }
}



</script>
<template>
  <Teleport to="body">
    <div v-if="status.visiable" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <nav>
          <div class="nav nav-tabs" role="tablist">
            <button class="nav-link active" id="nav-user-info" data-bs-toggle="tab" data-bs-target="#nav-user-info-panel" type="button" role="tab" aria-controls="nav-user-info-panel" aria-selected="true">个人信息</button>
            <button class="nav-link" id="nav-user-works" data-bs-toggle="tab" data-bs-target="#nav-user-works-panel" type="button" role="tab" aria-controls="nav-user-works-panel" aria-selected="false">历史作品</button>
          </div>
          <button type="button" class="btn-close" style="position: absolute;right: 10px;top: 10px" @click="close"></button>
        </nav>

        <div class="tab-content">
          <div class="tab-pane fade show active" id="nav-user-info-panel" role="tabpanel" aria-labelledby="nav-user-info" tabindex="0">
            <!-- 个人信息 -->
            <div class="input-group mb-3" style="margin-top: 5px;">
              <span class="input-group-text">昵称</span>
              <input type="text" class="form-control" aria-label="Username" v-model="uname">
            </div>
            <div class="flex frow" style="justify-content: right;">
              <button type="button" class="btn btn-primary" @click="changeName">更改</button>
            </div>
          </div>
          <div class="tab-pane fade table-outer" id="nav-user-works-panel" role="tabpanel" aria-labelledby="nav-user-works" tabindex="0">
            <!-- 历史作品 -->
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>作品</th>
                  <th>类型</th>
                  <th>创建时间</th>
                  <th>是否分享</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in worksFormatted" :key="`work-${item.id}`">
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.time }}</td>
                  <td>{{ item.share ? '√' : '×' }}</td>
                  <td class="flex frow" style="gap: 4px;">
                    <a type="button" class="btn btn-outline-dark btn-sm" :href="item.address">下载投影</a>
                    <button class="btn btn-outline-success btn-sm" @click="handleShare(item.fname,item.type,true)">分享</button>
                    <button class="btn btn-outline-danger btn-sm" @click="handleShare(item.fname,item.type,false)">取消分享</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
  z-index: 99;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  width: max-content;
  min-width: 30%;
}
.table-outer{
  height: 40vh;
  overflow: auto;
}
</style>
