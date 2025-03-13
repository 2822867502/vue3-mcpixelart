import axios from "axios"
import pako from "pako"
import { useUserStore } from "../store/user"
// 创建 axios 实例
const service = axios.create({
  baseURL: "/api",
  timeout: 60000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 携带用户标识
    const userStore = useUserStore()
    const uuid = userStore.uuid
    if (uuid) {
      config.headers["X-IDENT"] = uuid
    }
    // 使用pako压缩post请求体
    if (config.method === 'post' && config.data) {
      const compressedData = pako.gzip(JSON.stringify(config.data))
      config.data = compressedData

      config.headers['X-Encode'] = 'gzip'
      config.headers['Content-Type'] = 'application/octet-stream'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.status >= 400) {
      console.log(res.message || "请求出错")
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    console.error("请求失败", error)
    return Promise.reject(error.response?.data?.error || error)
  }
)

export default service