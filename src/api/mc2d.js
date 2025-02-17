import request from './index'

/**平面像素画生成 */
export function apiPixelart(data) {
  return request({
    url: '/pixelart',
    method: 'post',
    data,
  })
}

/**立体像素画生成 */
export function apiEnhance(data) {
  return request({
    url: '/pixelartEnhance',
    method: 'post',
    data,
  })
}
