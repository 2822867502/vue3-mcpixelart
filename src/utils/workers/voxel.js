import * as THREE from 'three'
// 体素单元集合
let voxelPoints = new Set()
// 顶点坐标
let largeArray = []
let mag = null

onmessage = function (event) {
  const { args } = event.data
  largeArray = args[0]
  mag = args[1]
  chunkedTraverse(
    largeArray,
    10e3, // 每片的大小
    (point, index) => {
      const p = new THREE.Vector3()
      //每个维度放大对应倍数
      for (let dim in mag) {
        p[dim] = point[dim] * mag[dim]
      }
      //向下取整
      p.floor()
      //转换为字符串存入Set
      voxelPoints.add([p.x,p.y,p.z].join(' '))
    },
    () => {
      // 转换回三维坐标
      postMessage({ result: [...voxelPoints].map(vp => vp.split(' ').map(vps => Number.parseInt(vps))) })
    }
  )
}

function chunkedTraverse(array, chunkSize, callback, onComplete) {
  let index = 0

  function processChunk() {
      // 计算当前片的结束位置
      const end = Math.min(index + chunkSize, array.length)

      // 遍历当前片
      for (let i = index; i < end; i++) {
          callback(array[i], i); // 对每个元素执行回调
      }

      // 更新索引
      index = end

      // 如果数组未遍历完，将下一片任务放入任务队列
      if (index < array.length) {
          setTimeout(processChunk, 0) // 通过setTimeout将任务放入下次事件循环
      } else {
          // 如果遍历完成，调用完成回调
          if (onComplete) onComplete()
      }
  }

  // 启动第一片任务
  setTimeout(processChunk, 0);
}
