import request from './index'

/**加载平面像素画 */
export function apiMusic(data) {
  return request({
    url: '/musicGen',
    method: 'post',
    data,
  })
}