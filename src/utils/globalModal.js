import { reactive, provide } from "vue"

export function useModal(){
  const modalStatus = reactive({
    title: '',
    message: '',
    visiable: false,
  })
  
  const showModal = (title, msg) => {
    modalStatus.title = title
    modalStatus.message = msg
    modalStatus.visiable = true
  }
  
  const closeModal = () => {
    modalStatus.visiable = false
  }

  return { modalStatus, closeModal, showModal }
}