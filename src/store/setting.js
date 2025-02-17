import { defineStore } from 'pinia'
import jsonBlocksArt from '@/assets/data/blocksArt.json'
import { reactive, ref, watch, computed } from 'vue'
import { formatInt } from '../utils/formatter'
import { useBlocksStore } from './blocksArt'
import { useHistoryStore } from './history'

/**
 * 数组去重
 * @param {array} array 
 * @returns {array}
 */
function removeDuplicates(array) {
  const uniqueSet = new Set()
  for (const rgb of array) {
      const rgbString = rgb.join(',')
      uniqueSet.add(rgbString)
  }
  const uniqueArray = Array.from(uniqueSet).map(rgbString => rgbString.split(',').map(Number))
  return uniqueArray
}
/**
 * 遍历blocks得到一个数组
 * @param {function} bk 对block操作后返回一个数组
 * @returns {array}
 */
const traverseBlocksArray = (bk) => {
  const res = []
  jsonBlocksArt.forEach(blocks => {
    blocks.bclass.forEach(block => {
      res.push(...bk(block))
    })
  })
  const rmvDupRes = removeDuplicates(res)
  return rmvDupRes
}

export const useSettingStore = defineStore('setting',() => {
  const blockStore = useBlocksStore()
  const historyStore = useHistoryStore()
  const blocksSetting = ref([])
  // 格式化后的Options 只读 组件读取设置时使用imgSetting
  const imgSetting = reactive({
    dither: false,
    enhance: false,
    width: 128,
    height: 128,
    rotate: 0,
    direction: 'z',
  })
  // 表单直接绑定的数据
  const Options = reactive({
    dither: false,
    enhance: false,
    width: 128,
    height: 128,
    rotate: 0,
    direction: 'z', // x y z x- y- z- 如果有负号则代表需要镜像
  })
  watch(
    Options,
    () => {
      imgSetting.width = formatInt(Options.width) || imgSetting.width
      imgSetting.height = formatInt(Options.height) || imgSetting.height
      imgSetting.rotate = formatInt(Options.rotate) || 0
      imgSetting.direction = Options.direction
      imgSetting.dither = Options.dither
      imgSetting.enhance = Options.enhance
    },
    {
      immediate: true,
      deep: true,
    }
  )
  /**所有选中的方块 */
  const selected = computed(() => {
    const res = []
    blocksSetting.value.forEach(type => {
      type.bclass.forEach(block => {
        if (block.select) res.push(block.name_eng)
      })
    })
    return res
  })
  watch(selected, () => {
    if (selected.value.length > 0) historyStore.setHistory2DBlocks(selected.value)
  })
  /**被选中的方块到颜色的映射 */
  const colorMapS = computed(() => {
    return Object.fromEntries(
      Object.entries(blockStore.colorMap).filter(v => selected.value.includes(v[0]))
    )
  })
  /**调色盘：所有被选中的方块的普通颜色集 */
  const palette = computed(() => 
    traverseBlocksArray(b => selected.value.includes(b.name_eng) ? [b.normal_rgb] : [])
  )
  /**调色盘：所有被选中的方块的所有颜色集 */
  const paletteEnhance = computed(() => 
    traverseBlocksArray(b => selected.value.includes(b.name_eng) ? [b.normal_rgb, b.low_rgb, b.high_rgb] : [])
  )
  
  /**初始化 */
  const init = () => {
    const hisSelected = historyStore.history2DBlocks
    blocksSetting.value = jsonBlocksArt.map(type => {
      const t = {
        bid: type.bid,
        bname: type.bname,
        bname_eng: type.bname_eng,
        bclass: []
      }
      type.bclass.forEach(block => {
        t.bclass.push({
          name: block.name,
          name_eng: block.name_eng,
          offset: `-${block.x * 16}px -${block.y * 16}px`,
          select: hisSelected.includes(block.name_eng),
        })
      })
      return t
    })
  }
  /**
   * 改变某一类方块的选择状态
   * @param {string} tname - 方块类名
   * @param {boolean} status - 选择状态
   */
  const selectType = (tname, status) => {
    blocksSetting.value.forEach(type => {
      if (type.bname === tname) {
        type.bclass.forEach(block => {
          block.select = status
        })
      }
    })
  }

  return {
    blocksSetting,
    imgSetting,
    Options,
    
    selected,
    colorMapS,
    palette,
    paletteEnhance,

    Options,

    init,
    selectType,
  }
})