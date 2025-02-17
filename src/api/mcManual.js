import request from './index'

/**加载平面像素画 */
export function apiReload(params) {
  return request({
    url: '/reload',
    method: 'get',
    params,
  })
}