import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './lang'
import electronPlugin from './plugins/electron'

const app = createApp(App)

// 使用路由
app.use(router)
// 使用国际化
app.use(i18n)
// 使用Electron插件
app.use(electronPlugin)

// 挂载应用
app.mount('#app')
