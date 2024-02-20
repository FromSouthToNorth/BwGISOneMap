import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { generateModifyVars } from './src/utils/modifyVars'

const root = process.cwd()
const pathResolve = (pathname: string) => resolve(root, '.', pathname)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: `${pathResolve('src')}/`,
      },
      // #/xxxx => types/xxxx
      {
        find: /#\//,
        replacement: `${pathResolve('types')}/`,
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: generateModifyVars(),
        javascriptEnabled: true,
      },
    },
  },
})
