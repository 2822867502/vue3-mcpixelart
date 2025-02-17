import { defineStore } from "pinia"
import { onMounted, reactive, ref, watch, shallowRef } from "vue"

export const useHistoryStore = defineStore('history', () => {
  /**记录上次手动搭建的链接+地图画制作完毕后自动导引到手动搭建 */
  if (localStorage.getItem('manual-url') == undefined) {
    localStorage.setItem('manual-url', '')
  }
  const historyManualAddress = shallowRef('')
  historyManualAddress.value = localStorage.getItem('manual-url')
  function setHistoryManualAddress(v) {
    historyManualAddress.value = v
    localStorage.setItem('manual-url', v)
  }

  /**记录上次选择过的方块 */
  if (localStorage.getItem('2d-blocks') == undefined) {
    localStorage.setItem('2d-blocks', '[]')
  }
  const history2DBlocks = shallowRef([])
  history2DBlocks.value = JSON.parse(localStorage.getItem('2d-blocks'))
  function setHistory2DBlocks(v) {
    history2DBlocks.value = v
    localStorage.setItem('2d-blocks', JSON.stringify(v))
  }

  /**用户uuid */
  if (localStorage.getItem('user-uuid') == undefined) {
    localStorage.setItem('user-uuid', '')
  }
  const historyUUID = shallowRef('')
  historyUUID.value = localStorage.getItem('user-uuid')
  function setHistoryUUID(v) {
    historyUUID.value = v
    localStorage.setItem('user-uuid', v)
  }
  /**用户uname */
  if (localStorage.getItem('user-uname') == undefined) {
    localStorage.setItem('user-uname', '')
  }
  const historyUname = shallowRef('')
  historyUname.value = localStorage.getItem('user-uname')
  function setHistoryUname(v) {
    historyUname.value = v
    localStorage.setItem('user-uname', v)
  }
  return {
    historyManualAddress,
    setHistoryManualAddress,

    history2DBlocks,
    setHistory2DBlocks,

    historyUUID,
    setHistoryUUID,

    historyUname,
    setHistoryUname,
  }
})