import Cookies from "js-cookie"
import { useHistoryStore } from '../store/history'
/**从旧版本移植到新版本需要做的改动
 * 
 * cookie中保存的信息移植到localStorage中
 */
export function transplant() {
  const historyStore = useHistoryStore()

  const url = Cookies.get('hist-bd-url')
  if (url) {
    historyStore.setHistoryManualAddress(url)
    Cookies.remove('hist-bd-url')
  }

  const blocks = Cookies.get('hist-bs')
  if (url) {
    historyStore.setHistory2DBlocks(blocks)
    Cookies.remove('hist-bs')
  }
  Cookies.remove('hist-id')
  Cookies.remove('hist-lang')
}
