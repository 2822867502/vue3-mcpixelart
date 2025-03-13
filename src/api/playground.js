import request from './index'
import pako from 'pako'
import { Parser } from 'pickleparser'
/**
 * 广场的卡片加载图片
 * 
 * 获取/api/rebuild/文件 并预处理python通过pickle保存的gzip文件
 * @param {string} url /art/文件名 或 /enhance/文件名
 * @returns {any} art以二维方块名数组保存 enhance以对象形式保存
 */
export function apiPlaygroundLoad(url) {
  return request({
    url: '/rebuild' + url,
    method: 'get',
    responseType: 'arraybuffer',
  }).then(response => {
    try {
      const decompressedData = pako.inflate(new Uint8Array(response))
      const parser = new Parser()
      const obj = parser.parse(decompressedData)
      return obj
    } catch (error) {
      throw error
    }
  })
}
/**
 * 预处理rebuild获得的数据
 */
export function pretreat(type, obj) {
  let matrix = []
  let h = 0,w = 0
  if (type === 'art') {
    matrix = obj
    h = obj.length
    w = obj[0].length
  }
  if (type === 'enhance') {
    const arr = []
    
    h = obj.size.length
    w = obj.size.width
    // 将一维pipe转换为二维arr
    for (let i = 0;i < h;i++) {
      const line = obj.pipe.slice(i * w, (i + 1) * w)
      arr.push(line.map(v => v[1]))
    }
    matrix = arr
  }
  return {
    matrix,
    h,
    w
  }
}
/**点赞 */
export function apiPlaygroundLike(id) {
  return request({
    url: '/user/like',
    method: 'post',
    data: { id },
  })
}
/**点踩 */
export function apiPlaygroundDislike(id) {
  return request({
    url: '/user/dislike',
    method: 'post',
    data: { id },
  })
}