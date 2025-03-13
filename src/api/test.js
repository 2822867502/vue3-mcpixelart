import request from './index'
/**post测试 */
export function apiPostTest(data) {
  return request({
    url: '/test',
    method: 'post',
    data,
  })
}

/**get测试 */
export function apiGetTest(params) {
  return request({
    url: '/test',
    method: 'get',
    params,
  })
}