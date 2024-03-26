import { resolve } from 'node:path'

import dayjs from 'dayjs'
import { readPackageJSON } from 'pkg-types'
import { type UserConfig, defineConfig, loadEnv, mergeConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { generateModifyVars } from '../src/utils/modifyVars'
import { commonConfig } from './common'

interface DefineOptions {
  overrides?: UserConfig
  options?: {
    //
  }
}

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions

  return defineConfig(async ({ mode }) => {
    const root = process.cwd()
    // const { VITE_PUBLIC_PATH } = loadEnv(
    //   mode,
    //   root,
    // )

    const defineData = await createDefineData(root)

    const pathResolve = (pathname: string) => resolve(root, '.', pathname)
    const timestamp = new Date().getTime()
    const applicationConfig: UserConfig = {
      // base: VITE_PUBLIC_PATH,
      resolve: {
        alias: [
          // @/xxxx => src/xxxx
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
      define: defineData,
      build: {
        target: 'es2015',
        cssTarget: 'chrome80',
        rollupOptions: {
          output: {
            // 入口文件名
            entryFileNames: `assets/entry/[name]-[hash]-${timestamp}.js`,
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router'],
              antd: ['ant-design-vue', '@ant-design/icons-vue'],
            },
          },
        },
      },
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: generateModifyVars(),
            javascriptEnabled: true,
          },
        },
      },
      plugins: [vue(), vueJsx()],
    }

    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig)

    return mergeConfig(mergedConfig, overrides)
  })
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root)
    const { dependencies, devDependencies, name, version } = pkgJson

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    }
  }
  catch (error) {
    return {}
  }
}

export { defineApplicationConfig }
