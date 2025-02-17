<script setup>
import * as THREE from 'three'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js" 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ref, inject, shallowRef, computed } from 'vue'
import { apiSculpture } from '../api/mc3d'

import { downloadFile } from '../utils/autoDownload'

const globalModal = inject('globalModal')
const waitTask = inject('waitTask')
const shareModal = inject('shareModal')

const modelOrigin = ref(null)
const sceneOrigin = {}
let pointsOrigin = []
const sizeOrigin = ref({
  x: 0,
  y: 0,
  z: 0,
})
const modelResult = ref(null)
const sceneTarget = {}
let pointsTarget = []
const sizeUserInput = ref({
  x: '10',
  y: '10',
  z: '10',
})
const sizeTarget = computed(() => {
  const res = {}
  for (const [k, v] of Object.entries(sizeUserInput.value)) {
    const int = parseInt(v)
    res[k] = isNaN(int) || int <= 0 ? 10 : int // 默认值设为10
  }
  return res
})
/**放大倍数 */
const magnification = computed(() => {
  const mag = {x: 1, y: 1,z: 1}
  for (const dim in mag) {
    if (sizeOrigin.value[dim] > 0) mag[dim] = sizeTarget.value[dim] / sizeOrigin.value[dim]
  }
  return mag
})
/**添加光源 */
function addLight(scene) { 
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight1.position.set(1, 1, 3).normalize()
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight2.position.set(-1, 1, 3).normalize()
  const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight3.position.set(0, -1, 3).normalize()
  scene.add(directionalLight1)
  scene.add(directionalLight2)
  scene.add(directionalLight3)
}
/**创建3D场景 初始化变量 */
function create3D(dom, obj) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75,1,0.01,1000)
  const renderer = new THREE.WebGLRenderer()
  //30vw
  const vw30 = window.innerWidth * 0.3
  renderer.setSize(vw30,vw30)
  
  addLight(scene)

  dom.value.innerHTML = ''
  dom.value.appendChild(renderer.domElement)
  
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', function () {
    renderer.render(scene, camera)
  })

  obj.scene = scene
  obj.camera = camera
  obj.renderer = renderer
  obj.controls = controls
}
/**打开.obj文件 */
function handlerFileOpen(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target.result
      const loader = new OBJLoader()
      const obj3D = loader.parse(fileContent)

      create3D(modelOrigin, sceneOrigin)
      sceneOrigin.scene.add(obj3D)

      const [points, size] = calcBounding(obj3D)
      pointsOrigin = points
      sizeOrigin.value = size

      sceneOrigin.camera.position.z = sizeOrigin.value.z * 2
    }
    
    reader.onerror = () => {
      globalModal('失败', '读文件出错')
    }
    reader.readAsText(file)
  } else {
    globalModal('失败', '请选择合法的.obj模型文件')
  }
}

function handlerDownload() {
  if (pointsTarget.length === 0) {
    globalModal('提示', '请先点击 <b> [制作] </b>')
    return
  }

  //得到dim维度最小最大值
  const getDimMinMax = function(data,dim) {
    const singleDimData = data.map(d => d[dim])
    return [Math.min(...singleDimData),Math.max(...singleDimData)]
  }

  let formattedVoxel = []
  //三个元素 代表三个维度的最小最大值
  let minmax = []

  for (let dim in [0,1,2]) {
    minmax.push(getDimMinMax(pointsTarget, dim))
  }
  //每个体素的坐标非负
  formattedVoxel = pointsTarget.map(v => [v[0] - minmax[0][0],v[1] - minmax[1][0],v[2] - minmax[2][0]])
  const postData = {
    scu: formattedVoxel,
    size: minmax.map(m => m[1] - m[0])
  }
  
  waitTask(apiSculpture(postData))
  .then(({ url }) => {
    shareModal('sculpture', url)
  })
  .catch(error => {
    globalModal('失败', error)
  })
}

function calcBounding(obj3D) {
  //获得正无穷向量
  function getMax3() {
    return new THREE.Vector3(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY)
  }
  //获得负无穷向量
  function getMin3() {
    return new THREE.Vector3(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY)
  }
  let minCorner = getMax3()
  let maxCorner = getMin3()
  /**顶点坐标 */
  let points = []
  for (let children of obj3D.children) {
    let array = children.geometry.attributes.position.array
    let count = children.geometry.attributes.position.count
    for (let i = 0;i < count;i += 3) {
      const v3 = new THREE.Vector3(array[i * 3],array[i * 3 + 1],array[i * 3 + 2])
      points.push(v3)

      minCorner.min(v3)
      maxCorner.max(v3)
    }
  }
  const bounding = maxCorner.clone().sub(minCorner)
  return [points, bounding]
}

let worker = null
// 根据原模型生成结果
async function generate() {
  if (pointsOrigin.length === 0) {
    globalModal('提示', '请选择合法的.obj模型文件')
    return
  }
  waitWorker(pointsOrigin, magnification.value)
  .then(voxelPoints => {
    pointsTarget = voxelPoints
    create3D(modelResult, sceneTarget)

    const geometry = new THREE.BoxGeometry(1,1,1)
    // 石头图片的base64编码
    const texture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABA0lEQVR4nH2TqZIFIQxFz1Th0gaF4X/7RzFRGKLnia7kBapn4lhyt8DPfd+/pJpzYmYAiAhmxlqL67piL1eZcwJgZtGQL4lIrFU1wPxu8ea1Vhy6gswM0Frb2EXkARAReu9hodbKnBMRodYa+15OAFBccvae7QDUWgMonwMUZ3HGUyLAGGOztNYCoPf+KPDKLGOMsOV3PDwHnnPuIapqMFzXxRgjGk57kYGznAGeit7KzL7v4Ew7N/8HWFSV1lrIdamquvnOWW1j9Mfhvv6avZ/7SN1uORFzwvlPuKoctJlRMqKZbWBZsojQWttG2nt/QjyZTjW58tSA7194Y33LxAm95wPTW9rwXQ/lWgAAAABJRU5ErkJggg==')
    texture.magFilter = THREE.NearestFilter
    const material = new THREE.MeshLambertMaterial({ map:texture })
    const cube = new THREE.Mesh(geometry, material)
    for (let pos of voxelPoints) {
      const cube_instance = cube.clone()
      cube_instance.position.set(pos[0],pos[1],pos[2])
      sceneTarget.scene.add(cube_instance)
    }

    sceneTarget.camera.position.z = sizeTarget.value.z * 2
  })
  .catch(r => console.log('catch',r))
}

const runWorker = (...args) => {
  return new Promise((resolve, reject) => {
    worker = new Worker(new URL('/src/utils/workers/voxel.js', import.meta.url),{type: 'module'})
    worker.onmessage = (event) => {
      const { result, error } = event.data
      worker.terminate()
      if (error) reject(error)
      else resolve(result)
    }
    worker.postMessage({ args })
  })
}
const waitWorker = (workerName, ...args) => {
  const w = runWorker(workerName, ...args)
  return waitTask([w, worker])
}

//渲染
function animate() {
  requestAnimationFrame(animate)
  if (sceneOrigin.scene)
    sceneOrigin.renderer.render(sceneOrigin.scene, sceneOrigin.camera)
  if (sceneTarget.scene)
    sceneTarget.renderer.render(sceneTarget.scene, sceneTarget.camera)
}
animate()

window.addEventListener('resize', () => {
  //30vw
  const vw30 = window.innerWidth * 0.3
  if (sceneOrigin.renderer) {
    sceneOrigin.renderer.setSize(vw30,vw30)
  }
  if (sceneTarget.renderer) {
    sceneTarget.renderer.setSize(vw30,vw30)
  }
})
</script>

<template>
  <div class="outer">
    <div class="alert alert-info" role="alert">
      请选择.obj模型文件,可从各3D模型网站下载
    </div>
    <!-- 打开文件 -->
    <div class="mb-3">
      <input class="form-control bg-dark text-light" type="file" accept=".obj,*.*" @change="handlerFileOpen">
    </div>
    <!-- 模型展示区 -->
    <div class="model-show-box">
      <div class="model-origin">
        <div class="t-shirt" ref="modelOrigin">
        </div>
        原模型
      </div>
      <div class="model-result">
        <div class="t-shirt" ref="modelResult">
        </div>
        效果
      </div>
    </div>
    <!-- 控制区 -->
    <div class="input-group">
      <span class="input-group-text bg-dark text-light">原模型尺寸</span>
      <span class="input-group-text bg-dark text-light">长</span>
      <span class="input-group-text bg-dark text-light">{{ sizeOrigin.x.toFixed(4) }}</span>
      <span class="input-group-text bg-dark text-light">宽</span>
      <span class="input-group-text bg-dark text-light">{{ sizeOrigin.y.toFixed(4) }}</span>
      <span class="input-group-text bg-dark text-light">高</span>
      <span class="input-group-text bg-dark text-light">{{ sizeOrigin.z.toFixed(4) }}</span>
    </div>
    <div class="input-group">
      <span class="input-group-text bg-dark text-light">游戏内尺寸</span>
      <span class="input-group-text bg-dark text-light">长</span>
      <input type="text" class="form-control bg-dark text-light" aria-label="length" v-model="sizeUserInput.x">
      <span class="input-group-text bg-dark text-light">宽</span>
      <input type="text" class="form-control bg-dark text-light" aria-label="width" v-model="sizeUserInput.y">
      <span class="input-group-text bg-dark text-light">高</span>
      <input type="text" class="form-control bg-dark text-light" aria-label="height" v-model="sizeUserInput.z">
      <button class="btn btn-primary" type="button" style="border: 1px solid white;" @click="generate">制作</button>
      <button class="btn btn-success" type="button" style="border: 1px solid white;" @click="handlerDownload">下载</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.outer {
  background-color: #4f4f4fa7;
  padding: 20px 10px;
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  color: antiquewhite;
  overflow-y: auto;
  user-select: none;
}
.model-show-box canvas,.t-shirt{
  width: 30vw;
  height: 30vw;
}

.model-show-box {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-around;
}

.model-origin,.model-result {
  display: flex;
  flex-flow: column nowrap;
  background-color: #4a5f9c;
  justify-content: center;
  text-align: center;
}
</style>