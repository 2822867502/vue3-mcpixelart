import request from './index'

/**雕塑生成 */
export function apiSculpture(data) {
  return request({
    url: '/sculpture',
    method: 'post',
    data,
  })
}
