import axios from "axios"
import { useUserStore } from "../store/user"
// 创建 axios 实例
const service = axios.create({
  baseURL: "/api",
  timeout: 60000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const uuid = userStore.uuid
    if (uuid) {
      config.headers["X-IDENT"] = uuid
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