import request from './index'

/**加载平面像素画 */
export function apiPlaygroundLoad(params) {
  return request({
    url: '/plgLoad',
    method: 'get',
    params,
  })
}