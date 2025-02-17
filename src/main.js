import { createApp } from 'vue'
import { router } from './router'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

// Import our custom CSS
import './style.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')