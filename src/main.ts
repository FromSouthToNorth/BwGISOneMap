import 'uno.css'
import '@/design/index.less'
import 'leaflet/dist/leaflet.css'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router'
import { setupStore } from './store'
import { bwSSOSDKLogin } from './utils/auth/sso'
import { setupRouterGuard } from './router/routes/guard'
import { setupGlobDirectives } from './directives'

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  // 配置 store
  setupStore(app)

  // Configure routing
  // 配置路由
  setupRouter(app)

  // router-guard
  // 路由守卫
  setupRouterGuard(router)

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app)

  app.mount('#app')
}

bwSSOSDKLogin(() => {
  bootstrap()
})
