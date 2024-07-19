import { defineApplicationConfig } from './vite-config/application'

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
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
        '/BwGISOneMap/mqtt': {
          target: 'ws://192.168.133.110:33382',
          ws: true,
          rewrite: path => path.replace(/^\/BwGISOneMap\/mqtt/, '/mqtt'),
        },
        '/cas/': {
          target: 'http://192.168.133.110:33382',
          ws: true,
        },
        '/BwDeviceManage': {
          target: 'http://192.168.133.110:33382',
          ws: true,
        },
      },
      open: true, // 项目启动后，自动打开
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
  },
})
