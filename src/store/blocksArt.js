import { defineStore } from 'pinia'
import jsonBlocksArt from '@/assets/data/blocksArt.json'

/**函数工厂
 * 
 * 遍历blocks得到一个映射对象
 * @param {function} k - 映射对象的键取block何值
 * @param {function} v - 映射对象的值取block何值
 * @returns {function}
 * @example traverseBlocks(k => k.name_eng, v => v.offset)
 */
const traverseBlocks = (k, v) => {
  return () => {
    const res = {}
    jsonBlocksArt.forEach(blocks => {
      blocks.bclass.forEach(block => {
        res[k(block)] = v(block)
      })
    })
    return res
  }
}
/**函数工厂
 * 
 * 遍历blocks得到一个数组
 * @param {function} bk 对block操作后返回一个数组
 * @returns {function}
 */
const traverseBlocksArray = (bk) => {
  return () => {
    const res = []
    jsonBlocksArt.forEach(blocks => {
      blocks.bclass.forEach(block => {
        res.push(...bk(block))
      })
    })
    const rmvDupRes = removeDuplicates(res)
    return rmvDupRes
  }
}

export const useBlocksStore = defineStore('blocksArt', {
  state: () => ({
    blocksArt: jsonBlocksArt,
  }),

  getters: {
    /**得到所有方块对象 */
    allBlocks: (state) => {
      const res = []
      state.blocksArt.forEach(blocks => {
        blocks.forEach(block => {
          res.push(block)
        })
      })
      return res
    },
    /**所有普通色的数组 */
    palette: traverseBlocksArray(b => [b.normal_rgb]),
    /**所有地图色的数组 */
    paletteEnhance: traverseBlocksArray(b => [b.normal_rgb, b.low_rgb, b.high_rgb]),
    /**方块名和rgb的映射 */
    colorMap: traverseBlocks(k => k.name_eng, v => ({
      normal: v.normal_rgb,
      low: v.low_rgb,
      high: v.high_rgb,
    })),
    /**方块名和十六进制色值的映射 */
    colorHexMap: traverseBlocks(k => k.name_eng, v => ({
      normal: v.normal,
      low: v.low,
      high: v.high,
    })),
    /**英中名称映射 */
    ecMap: traverseBlocks(k => k.name_eng, v => v.name),
    /**名称到图像偏移量的映射 */
    offsetMap: traverseBlocks(k => k.name_eng, v => v.offset),
    xyMap: traverseBlocks(k => k.name_eng, v => [v.x, v.y]),
  },

  actions: {
  },
})
