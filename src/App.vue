<script setup>
import { provide } from 'vue';
import Layout from './components/Layout.vue'

import { transplant } from './utils/transplant'
transplant()

import { useUserStore } from './store/user'
const userStore = useUserStore()
userStore.init()

import { useSettingStore } from './store/setting'
const setting = useSettingStore()
setting.init() //初始化setting

import GlobalModal from './components/GlobalModal.vue'
import { useModal } from './utils/globalModal'
const { modalStatus, closeModal, showModal } = useModal()
provide('globalModal', showModal)

import ShareModal from './components/ShareModal.vue'
import { useShare } from './utils/shareModal'
const { shareStatus, closeShare, showShare } = useShare()
provide('shareModal', showShare)

import Waiting from './components/Waiting.vue'
import { useWait } from './utils/waitModal'
const {  waitStatus, closeWait, showWait } = useWait()
provide('waitTask', showWait)

import UserInfo from './components/UserInfo.vue'
import { useUser } from './utils/userModal'
const { userStatus, closeUser, showUser } = useUser()
provide('userInfo', showUser)
</script>

<template>
  <Layout>
    <template #default>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </template>
  </Layout>
  <Waiting @customClose="closeWait" :status="waitStatus"></Waiting>
  <GlobalModal @customClose="closeModal" :status="modalStatus"></GlobalModal>
  <ShareModal @customClose="closeShare" :status="shareStatus"></ShareModal>
  <UserInfo @customClose="closeUser" :status="userStatus"></UserInfo>
</template>