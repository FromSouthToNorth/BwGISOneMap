import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { PluginOption } from 'vite'
import { configHtmlPlugin } from './html'

interface Options {
  isBuild: boolean
  root: string
  compress: string
  enableMock?: boolean
  enableAnalyze?: boolean
}

async function createPlugins({ isBuild }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin({ isBuild }))

  return vitePlugins
}

export { createPlugins }
