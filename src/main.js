import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './lang'

const app = createApp(App)

// 浣跨敤璺敱
app.use(router)
// 浣跨敤鍥介檯鍖?app.use(i18n)

// 鎸傝浇搴旂敤
app.mount('#app')
