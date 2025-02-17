import { reactive } from "vue"

export function useShare(){
  const shareStatus = reactive({
    type: '',
    fname: '',
    download: true,
    visiable: false,
  })
  
  const showShare = (type, fname, download=true) => {
    shareStatus.type = type
    shareStatus.fname = fname
    shareStatus.download = download
    shareStatus.visiable = true
  }
  
  const closeShare = () => {
    shareStatus.visiable = false
  }

  return { shareStatus, closeShare, showShare }
}