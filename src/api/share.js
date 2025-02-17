import request from './index'

/**分享作品 */
export function apiShare(data) {
  return request({
    url: '/share/share',
    method: 'post',
    data,
  })
}

/**分享作品 */
export function apiFeed(params) {
  return request({
    url: '/share/feed',
    method: 'get',
    params,
  })
}