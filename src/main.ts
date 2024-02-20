import 'uno.css'
import '@/design/index.less'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  // 配置 store
  setupStore(app)

  // Configure routing
  // 配置路由
  setupRouter(app)

  app.mount('#app')
}

bootstrap()
