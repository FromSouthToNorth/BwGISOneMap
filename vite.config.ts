import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { generateModifyVars } from './src/utils/modifyVars'

const root = process.cwd()
const pathResolve = (pathname: string) => resolve(root, '.', pathname)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), UnoCSS()],
  server: {
    proxy: {
      '/net': {
        target: 'http://192.168.133.110:33382/',
        changeOrigin: true,
      },
      '/gis': {
        target: 'http://192.168.133.110:33382',
      },
      '/bwmes-boot/': {
        target: 'http://192.168.133.110:33382/',
        changeOrigin: true,
      },
      '/BwMap': {
        target: 'http://192.168.133.207:33391/bigemap.globalMap/',
        // pathRewrite: {
        //   '^/BwMap': '',
        // },
        rewrite: path => path.replace(/^\/BwMap/, ''),
      },
      '/bwmes': {
        target: 'http://192.168.133.110:33382/',
      },
      '/Home': {
        target: 'http://192.168.133.110:33382/',
      },
      '/bwportal': {
        target: 'http://192.168.133.110:33382',
      },
      '/bwoffice': {
        target: 'http://192.168.133.110:33382',
      },
      '/cas/': {
        target: 'http://192.168.133.110:33382',
        ws: true,
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
