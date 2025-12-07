import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './lang'

const app = createApp(App)

// 使用路由
app.use(router)
// 使用国际化
app.use(i18n)

// 挂载应用
app.mount('#app')
