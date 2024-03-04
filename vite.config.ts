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
  server: {
    proxy: {
      '/gis': {
        target: 'http://192.168.133.110:33382',
      },
      '/BwMap': {
        target: 'http://192.168.133.207:33391/bigemap.globalMap/',
        // pathRewrite: {
        //   '^/BwMap': '',
        // },
        rewrite: path => path.replace(/^\/BwMap/, ''),
      },
    },
  },
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
