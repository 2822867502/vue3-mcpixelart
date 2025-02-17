import { reactive, provide } from "vue"

export function useWait(){
  const waitStatus = reactive({
    title: '',
    message: '',
    visiable: false,
  })
  // 用于取消任务
  let currentWork = null
  let promiseReject = null
  let promiseRace = null
  
  const closeWait = () => {
    const reason = '用户取消'
    currentWork?.terminate()
    if (promiseReject) promiseReject(reason)
    waitStatus.visiable = false
  }

  // 显示模态框并执行任务
  const showWait = async (task, ...args) => {
    waitStatus.visiable = true
    // 打开模态框时都要更新一次
    currentWork = null
    promiseReject = null
    promiseRace = new Promise((resolve, reject) => {
      promiseReject = reject
    })

    try {
      let result
      let promiseTask
      if (typeof task === "string") {
        promiseTask = runTaskInWorker(task, args)
      } else if (task instanceof Array) {
        [promiseTask, currentWork] = task
      } else if (task instanceof Promise) {
        promiseTask = task
      } else {
        throw new TypeError('必须是string,Array或Promise')
      }
      result = await Promise.race([promiseTask, promiseRace])
      return result
    } finally {
      waitStatus.visiable = false
    }
  }

  // Web Worker 实现异步任务
  const runTaskInWorker = (fn, args) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("/src/utils/workers/worker.js", import.meta.url), { type: "module" });
      currentWork = worker
      worker.onmessage = (event) => {
        const { result, error } = event.data
        worker.terminate()
        if (error) reject(error)
        else resolve(result)
      }

      worker.postMessage({ fnStr: fn, args })
    })
  }

  return { waitStatus, closeWait, showWait }
}