import { createApp } from 'vue'
import { router } from './router'
import './style.css'
import './utils/fix.js'
import App from './App.vue'
import { createPinia } from 'pinia'

// Import our custom CSS
import './style.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { setupErrorHandling } from './utils/errorReporter.js'

const app = createApp(App)

// 错误主动上报
setupErrorHandling(app)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')