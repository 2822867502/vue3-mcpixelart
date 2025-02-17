import { defineStore } from 'pinia'
/**存放制作好的成品 可以直接发送网络请求的数据 */
export const useProductStore = defineStore('product', {
  state: () => ({
    pixelArt: null,
    pixelArtEnhance: null,
  }),

  getters: {
  },

  actions: {
    setPixelArt(v) {
      this.pixelArt = v
    },
    setPixelArtEnhance(v) {
      this.pixelArtEnhance = v
    }
  },
})