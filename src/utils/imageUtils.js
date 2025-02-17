import { useBlocksStore } from '../store/blocksArt'
const blocksStore = useBlocksStore()
import BlockCSS from '../assets/img/BlockCSS.png'
export default {
  /**
   * 从图片文件获取 ImageData
   * @param {File} file - 用户上传的图片文件
   * @returns {Promise<ImageData>}
   */
  async getImageDataFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          resolve(ctx.getImageData(0, 0, img.width, img.height))
        };
        img.onerror = reject
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /**
   * 从 <img> 标签获取 ImageData
   * @param {HTMLImageElement} img - HTML 图片元素
   * @returns {ImageData}
   */
  getImageDataFromImgElement(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, img.width, img.height);
  },

  /**
   * 灰度化处理 (黑白图片)
   * @param {ImageData} imageData
   * @returns {ImageData}
   */
  grayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    return imageData;
  },

  /**
   * 颜色反转处理
   * @param {ImageData} imageData
   * @returns {ImageData}
   */
  invertColors(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]; // R
      data[i + 1] = 255 - data[i + 1]; // G
      data[i + 2] = 255 - data[i + 2]; // B
    }
    return imageData;
  },

  /**
   * 将 ImageData 画回 canvas 并转换为 Blob (可用于下载)
   * @param {ImageData} imageData
   * @returns {Promise<Blob>}
   */
  imageDataToBlob(imageData) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(resolve, "image/png");
    });
  },
  /**
   * 对 ImageData 进行放缩
   * @param {ImageData} imageData - 原始 ImageData
   * @param {number} w - 宽度
   * @param {number} h - 高度
   * @returns {ImageData} - 处理后的 ImageData
   */
  scaleImageData1(imageData, w, h) {
    if (w * h <= 0) throw new Error("图片尺寸必须大于0")

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // 设置新的 canvas 尺寸
    canvas.width = w
    canvas.height = h

    // 将原始 ImageData 转换为图像对象
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = imageData.width
    tempCanvas.height = imageData.height
    tempCanvas.getContext("2d").putImageData(imageData, 0, 0)

    // 使用 drawImage 进行放缩
    ctx.drawImage(tempCanvas, 0, 0, w, h)

    // 返回缩放后的 ImageData
    return ctx.getImageData(0, 0, w, h)
  },

  /**
   * 对 ImageData 进行放缩
   * @param {ImageData} imageData - 原始 ImageData
   * @param {number} scale - 缩放倍数 (如 0.5 缩小一半, 2 放大 2 倍)
   * @returns {ImageData} - 处理后的 ImageData
   */
  scaleImageData2(imageData, scale) {
    if (scale <= 0) throw new Error("缩放比必须大于0")

    const newWidth = Math.round(imageData.width * scale)
    const newHeight = Math.round(imageData.height * scale)
    return this.scaleImageData1(imageData, newWidth, newHeight)
  },

  scaleImageData(...args) {
    switch (args.length) {
      case 2:
        return this.scaleImageData2(...args)
      case 3:
        return this.scaleImageData1(...args)
      default:
        throw new Error('参数数目不匹配')
    }
  },
  /**弗洛伊德抖动算法
   * @param {ImageData} imageData 原图
   * @param {Int8Array[]} palette 调色盘数组
   * @returns {ImageData} 新图
   */
  floydSteinbergDither(imageData, palette) {
    const { width, height, data } = imageData
    
    function getIndex(x, y) {
      return (y * width + x) * 4
    }
    
    function closestPaletteColor(r, g, b) {
      return palette.reduce((prev, curr) => {
        const prevDist = Math.pow(prev[0] - r, 2) + Math.pow(prev[1] - g, 2) + Math.pow(prev[2] - b, 2)
        const currDist = Math.pow(curr[0] - r, 2) + Math.pow(curr[1] - g, 2) + Math.pow(curr[2] - b, 2)
        return currDist < prevDist ? curr : prev
      })
    }
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = getIndex(x, y)
        
        const oldR = data[index]
        const oldG = data[index + 1]
        const oldB = data[index + 2]
        
        const [newR, newG, newB] = closestPaletteColor(oldR, oldG, oldB)
        
        data[index] = newR
        data[index + 1] = newG
        data[index + 2] = newB
        
        const errR = oldR - newR
        const errG = oldG - newG
        const errB = oldB - newB
        
        function distributeError(xOffset, yOffset, factor) {
          const neighborX = x + xOffset
          const neighborY = y + yOffset
          
          if (neighborX >= 0 && neighborX < width && neighborY >= 0 && neighborY < height) {
            const neighborIndex = getIndex(neighborX, neighborY)
            data[neighborIndex] += errR * factor
            data[neighborIndex + 1] += errG * factor
            data[neighborIndex + 2] += errB * factor
          }
        }
        
        distributeError(1, 0, 7 / 16)
        distributeError(-1, 1, 3 / 16)
        distributeError(0, 1, 5 / 16)
        distributeError(1, 1, 1 / 16)
      }
    }
    return imageData
  },
  /**从二维数组重建图片
   * @param {string[][]} array 
   */
  rebuildImage(array) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = BlockCSS
      img.crossOrigin = 'Anonymous'

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const h = array.length
        const w = array[0].length

        const newWidth = h * 8
        const newHeight = w * 8
        canvas.width = newWidth
        canvas.height = newHeight

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let y = 0;y < h;y++) {
          for (let x = 0;x < w;x++) {
            const [m, n] = blocksStore.xyMap[array[y][x]]
            // 在 (x, y) 位置绘制从 (m, n) 处截取的 8x8 区域
            ctx.drawImage(img, m * 16, n * 16, 16, 16, x * 8, y * 8, 8, 8)
          }
        }
        const newImageUrl = canvas.toDataURL('image/png')
        resolve(newImageUrl)
      }

      img.onerror = () => reject(new Error('图片加载失败'))
    })
  }

}
