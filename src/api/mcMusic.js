import request from './index'

/**制作红石音乐 */
export function apiMusic(data) {
  return request({
    url: '/musicGen',
    method: 'post',
    data,
  })
}