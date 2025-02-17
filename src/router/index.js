import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/HomePage.vue') },
  { path: '/2d', component: () => import('../views/Minecraft2D.vue') },
  { path: '/manual', component: () => import('../views/MinecraftManual.vue') },
  { path: '/3d', component: () => import('../views/Minecraft3D.vue') },
  { path: '/music', component: () => import('../views/MinecraftMusic.vue') },
  { path: '/playground', component: () => import('../views/Playground.vue') },
  { path: '/version', component: () => import('../views/Versions.vue') },
  { path: '/privacy', component: () => import('../views/Privacy.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})