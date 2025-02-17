import { useSettingStore } from "../store/setting"
const settingStore = useSettingStore()

import { useProductStore } from "../store/product"
const productStore = useProductStore()

import { Counter } from "./dataStruct"
/**透明阈值 */
const TRANSPARENT = 100

export default {
  /**
   * 找出最接近 targetRgb 的方块
   * @param {number[]} targetRgb - RGB色值
   * @param {boolean} enhance - 启用强化地图画
   * @returns {object} 最接近的方块名、色值和修饰
   */
  findClosestColor(targetRgb, enhance) {
    const colorMap = settingStore.colorMapS
    function rgbDistance(rgb1, rgb2) {
      return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
      )
    }
 
    let closest = null
    let minDistance = Infinity
    let closestColorType = null
 
    for (const block in colorMap) {
      if (colorMap.hasOwnProperty(block)) {
        const colors = colorMap[block]
        for (const colorType in colors) {
          if (colors.hasOwnProperty(colorType) &&
            (!enhance || (enhance && colorType !== 'normal'))) {
            const currentRgb = colors[colorType]
            const distance = rgbDistance(targetRgb, currentRgb)

            if (distance < minDistance) {
              minDistance = distance
              closest = block
              closestColorType = colorType
            }
          } else if (enhance === false && colorType === 'normal') {
            const currentRgb = colors[colorType]
            const distance = rgbDistance(targetRgb, currentRgb)

            if (distance < minDistance) {
              minDistance = distance
              closest = block
              closestColorType = colorType
            }
          }
        }
      }
    }
 
    return {
      block: closest,
      color: colorMap[closest][closestColorType],
      modify: closestColorType
    }
  },
  /**制作普通像素画 */
  make(img, w, h) {
    // 用来存放预览图
    const newImg = new ImageData(w ,h)
    // 像素点计数器
    let index = 0
    // 用来统计所用方块的数量
    const counter = new Counter()
    // 用来存储像素画的方块信息
    const blockMatrix = Array.from({ length: h }, () =>
      Array(w).fill('')
    )
    const needMirror = settingStore.imgSetting.direction.includes('-')
    // 行扫描
    for (let y = 0;y < h;y++) {
      for (let x = 0;x < w;x++) {
        // 原图像素点rgba
        const pixelRGBA = img.data.slice(index * 4, index * 4 + 4)
        // 原图像素点rgb
        const pixelRGB = pixelRGBA.slice(0, 3)
        // 原图像素点透明通道
        const pixelA = pixelRGBA[3]
        // 根据是否镜像修正x为x_
        const x_ = needMirror ? w - x - 1 : x
        if (pixelA < TRANSPARENT) {
          // 像素点透明
          newImg.data.set([0, 0, 0, 0], index * 4)
          blockMatrix[y][x_] = 'air'
        } else {
          // 像素点不透明
          const { color:colorArt, block } = this.findClosestColor(pixelRGB, false)

          counter.set(block)
          newImg.data.set([...colorArt, 255], index * 4)
          blockMatrix[y][x_] = block
        }
        
        index++
      }
    }

    productStore.setPixelArt(blockMatrix)
    return {
      img: newImg,
      counter,
    }
  },
  /**制作强化地图画 */
  makeEnhance(img, w, h) {
    // 用来存放预览图
    const newImg = new ImageData(w ,h)
    // 用来统计所用方块的数量
    const counter = new Counter()
    // 用来存储像素画的方块信息
    const blockMatrix = Array.from({ length: h }, () =>
      Array(w).fill('')
    )
    // 用来存储像素画的深度信息
    const DepthMatrix = Array.from({ length: h }, () =>
      Array(w).fill(0)
    )
    // 记录每一列最高点和最低点竖直坐标(相对值)
    const headPos = new Array(w)
    const footPos = new Array(w)

    // 列扫描
    for (let x = 0;x < w;x++) {
      // 初始方块竖直高度设为0 head、foot用于记录pos最大最小值
      let pos = 0,head = 0,foot = 0
      for (let y = 0;y < h;y++) {
        // 像素点偏移量
        const offset = (y * w + x) * 4
        // 原图像素点rgba
        const pixelRGBA = img.data.slice(offset, offset + 4)
        // 原图像素点rgb
        const pixelRGB = pixelRGBA.slice(0, 3)

        const { color:colorArt, block, modify } = this.findClosestColor(pixelRGB, true)
        // 从北向南的方向 modify和相邻方块相对高度的映射
        const modifyMap = {
          'normal': 0,
          'low': -1,
          'high': 1,
        }
        pos += modifyMap[modify]
        if (y < h - 1) {
          // 当前方块的修饰符决定南面方块的相对位置 因此是y+1
          DepthMatrix[y + 1][x] = pos
        }
        
        head = Math.max(pos, head)
        foot = Math.min(pos, foot)

        counter.set(block)
        newImg.data.set([...colorArt, 255], offset)
        blockMatrix[y][x] = block
      }
      // 一列遍历完毕后把该列高度最大最小值存入数组
      headPos[x] = head
      footPos[x] = foot
    }
    // 记录每一列的总高度
    const deltaPos = new Array(w)
    for(let i = 0;i < w;i++) {
      deltaPos[i] = headPos[i] - footPos[i] + 1
    }
    // 强化地图画总高度
    const totleHeight = Math.max(...deltaPos)

    const pipe = []
    // 深度矩阵转换为非负
    for (let y = 0;y < h;y++) {
      for (let x = 0;x < w;x++) {
        const depth = DepthMatrix[y][x] - footPos[x]
        pipe.push([[x, depth, y], 'minecraft:' + blockMatrix[y][x]])
      }
    }

    const size = {
      width: w,
      length: h,
      height: totleHeight
    }

    productStore.setPixelArtEnhance({
      size,
      pipe
    })
    return {
      img: newImg,
      counter,
    }
  },
}