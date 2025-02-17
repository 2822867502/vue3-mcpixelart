import { reactive } from "vue"

export function useUser(){
  const userStatus = reactive({
    visiable: false,
  })
  
  const showUser = () => {
    userStatus.visiable = true
  }
  
  const closeUser = () => {
    userStatus.visiable = false
  }

  return { userStatus, closeUser, showUser }
}