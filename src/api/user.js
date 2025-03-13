import request from './index'

/**注册新用户 */
export function apiUserNew() {
  return request({
    url: '/user/genid',
    method: 'get',
  })
}

/**改名 */
export function apiChangeName(data) {
  return request({
    url: '/user/cname',
    method: 'post',
    data,
  })
}

/**登录 */
export function apiUserLogin() {
  return request({
    url: '/user/login',
    method: 'get',
  })
}

/**根据uid得到用户名 */
export function apiGetUname(data) {
  return request({
    url: '/user/unamelist',
    method: 'post',
    data,
  })
}

/**得到历史作品 */
export function apiGetHistory() {
  return request({
    url: '/user/history',
    method: 'get',
  })
}