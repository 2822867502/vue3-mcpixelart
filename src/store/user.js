import { defineStore } from 'pinia'
import { apiUserNew, apiGetUname, apiUserLogin } from '../api/user'
import { useHistoryStore } from './history'
/**用户相关 */
export const useUserStore = defineStore('user', {
  state: () => ({
    // 存储用户自己的uuid和uname
    uuid: '',
    uname: '',
    // uid->uname缓存映射
    userUidMap: new Map(),
  }),

  getters: {
  },

  actions: {
    // 将用户信息从localStorage载入
    init() {
      const historyStore = useHistoryStore()
      let uuid = historyStore.historyUUID
      let uname = historyStore.historyUname
      if (uuid === '') {
        apiUserNew()
        .then(resp => {
          this.uuid = resp.uuid
          this.uname = resp.uname
          historyStore.setHistoryUUID(resp.uuid)
          historyStore.setHistoryUname(resp.uname)
        })
        .catch(err => console.error(err))
      } else {
        this.uuid = uuid
        this.uname = uname
        apiUserLogin()
        .then(([u]) => {
          this.uname = u.uname
          historyStore.setHistoryUname(u.uname)
        })
      }
    },
    // 根据数据里未缓存的uid加载uname存入userUidSet
    cache(data) {
      // 每个uid只查询一次
      const uidSet = new Set()
      data.map(({ uid }) => {
        if (!this.userUidMap.has(uid)) {
          uidSet.add(uid)
        }
      })
      const uidArr = Array.from(uidSet)
      apiGetUname(uidArr)
      .then(ulist => {
        ulist.forEach(({uid, uname}) => {
          this.userUidMap.set(uid, uname)
        })
      })
    },
    // 改名
    changeName(newName) {
      const historyStore = useHistoryStore()
      this.uname = newName
      historyStore.setHistoryUname(newName)
    },
  },
})