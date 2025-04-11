import request from './index'

/**错误上报 */
export function apiErrorReport(data) {
  // 防止错误上报自身的死循环
  if (data.msg && data.msg.includes('/api/error')) return
  return request({
    url: '/error/',
    method: 'post',
    data,
  })
}