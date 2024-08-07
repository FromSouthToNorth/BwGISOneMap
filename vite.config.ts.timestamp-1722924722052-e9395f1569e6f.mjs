// vite-config/application.ts
import { resolve as resolve2 } from "node:path";
import dayjs from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import { readPackageJSON } from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/pkg-types@1.0.3/node_modules/pkg-types/dist/index.mjs";
import { defineConfig, loadEnv, mergeConfig } from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/vite@5.1.3_@types+node@20.11.19_less@4.2.0_terser@5.30.0/node_modules/vite/dist/node/index.js";

// src/utils/modifyVars.ts
import { resolve } from "node:path";
import { generate } from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/@ant-design+colors@7.0.2/node_modules/@ant-design/colors/lib/index.js";
import { theme } from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/ant-design-vue@4.1.2_vue@3.4.19_typescript@5.3.3_/node_modules/ant-design-vue/lib/index.js";
import convertLegacyToken from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/ant-design-vue@4.1.2_vue@3.4.19_typescript@5.3.3_/node_modules/ant-design-vue/lib/theme/convertLegacyToken.js";
var { defaultAlgorithm, defaultSeed } = theme;
var primaryColor = "#0960bd";
function generateAntColors(color, theme2 = "default") {
  return generate(color, {
    theme: theme2
  });
}
function generateModifyVars() {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];
  const primaryColorObj = {};
  for (let index = 0; index < 10; index++)
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  const mapToken = defaultAlgorithm(defaultSeed);
  const v3Token = convertLegacyToken.default(mapToken);
  return {
    ...v3Token,
    // reference:  Avoid repeated references
    "hack": `true; @import (reference) "${resolve("src/design/config.less")}";`,
    "primary-color": primary,
    ...primaryColorObj,
    "info-color": primary,
    "processing-color": primary,
    "success-color": "#55D187",
    //  Success color
    "error-color": "#ED6F6F",
    //  False color
    "warning-color": "#EFBD47",
    //   Warning color
    "font-size-base": "14px",
    //  Main font size
    "border-radius-base": "2px",
    //  Component/float fillet
    "link-color": primary
    //   Link color
  };
}

// vite-config/common.ts
import UnoCSS from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/unocss@0.58.5_postcss@8.4.35_rollup@4.12.0_vite@5.1.3_@types+node@20.11.19_less@4.2.0_terser@5.30.0_/node_modules/unocss/dist/vite.mjs";
var commonConfig = (mode) => ({
  server: {
    host: true
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : []
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3
    }
  },
  plugins: [UnoCSS()]
});

// vite-config/plugins/index.ts
import vue from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.3_@types+node@20.11.19_less@4.2.0_terser@5.30.0__vue@3.4.19_typescript@5.3.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.1.3_@types+node@20.11.19_less@4.2.0_terser@5.30.0__vue@3.4.19_typescript@5.3.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// vite-config/plugins/html.ts
import { createHtmlPlugin } from "file:///D:/2DGIS/BwGISOneMap/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.1.3_@types+node@20.11.19_less@4.2.0_terser@5.30.0_/node_modules/vite-plugin-html/dist/index.mjs";
function configHtmlPlugin({ isBuild }) {
  const htmlPlugin = createHtmlPlugin({
    minify: isBuild
  });
  return htmlPlugin;
}

// vite-config/plugins/index.ts
async function createPlugins({ isBuild }) {
  const vitePlugins = [vue(), vueJsx()];
  vitePlugins.push(configHtmlPlugin({ isBuild }));
  return vitePlugins;
}

// vite-config/application.ts
function defineApplicationConfig(defineOptions = {}) {
  const { overrides = {} } = defineOptions;
  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === "build";
    const { VITE_BUILD_COMPRESS } = loadEnv(
      mode,
      root
    );
    const plugins = await createPlugins({ isBuild, root, compress: VITE_BUILD_COMPRESS });
    const defineData = await createDefineData(root);
    const pathResolve = (pathname) => resolve2(root, ".", pathname);
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    const applicationConfig = {
      // base: VITE_PUBLIC_PATH,
      resolve: {
        alias: [
          // @/xxxx => src/xxxx
          {
            find: /@\//,
            replacement: `${pathResolve("src")}/`
          },
          // #/xxxx => types/xxxx
          {
            find: /#\//,
            replacement: `${pathResolve("types")}/`
          }
        ]
      },
      define: defineData,
      build: {
        target: "es2015",
        cssTarget: "chrome80",
        rollupOptions: {
          output: {
            // 入口文件名
            entryFileNames: `assets/entry/[name]-[hash]-${timestamp}.js`,
            manualChunks: {
              vue: ["vue", "pinia", "vue-router"],
              antd: ["ant-design-vue", "@ant-design/icons-vue"]
            }
          }
        }
      },
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: generateModifyVars(),
            javascriptEnabled: true
          }
        }
      },
      plugins
    };
    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}
async function createDefineData(root) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;
    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
    };
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    };
  } catch (error) {
    return {};
  }
}

// vite.config.ts
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US"
      ]
    },
    server: {
      proxy: {
        "/net": {
          target: "http://192.168.133.110:33382/",
          changeOrigin: true
        },
        "/gis": {
          target: "http://192.168.133.110:33382"
        },
        "/bwmes-boot/": {
          target: "http://192.168.133.110:33382/",
          changeOrigin: true
        },
        "/BwMap": {
          target: "http://192.168.133.207:33391/bigemap.globalMap/",
          rewrite: (path) => path.replace(/^\/BwMap/, "")
        },
        "/bwmes": {
          target: "http://192.168.133.110:33382/"
        },
        "/Home": {
          target: "http://192.168.133.110:33382/"
        },
        "/bwportal": {
          target: "http://192.168.133.110:33382"
        },
        "/bwoffice": {
          target: "http://192.168.133.110:33382"
        },
        "/BwGISOneMap/mqtt": {
          target: "ws://192.168.133.110:33382",
          ws: true,
          rewrite: (path) => path.replace(/^\/BwGISOneMap\/mqtt/, "/mqtt")
        },
        "/cas/": {
          target: "http://192.168.133.110:33382",
          ws: true
        },
        "/BwDeviceManage": {
          target: "http://192.168.133.110:33382",
          ws: true
        }
      },
      open: true,
      // 项目启动后，自动打开
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS1jb25maWcvYXBwbGljYXRpb24udHMiLCAic3JjL3V0aWxzL21vZGlmeVZhcnMudHMiLCAidml0ZS1jb25maWcvY29tbW9uLnRzIiwgInZpdGUtY29uZmlnL3BsdWdpbnMvaW5kZXgudHMiLCAidml0ZS1jb25maWcvcGx1Z2lucy9odG1sLnRzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcMkRHSVNcXFxcQndHSVNPbmVNYXBcXFxcdml0ZS1jb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXDJER0lTXFxcXEJ3R0lTT25lTWFwXFxcXHZpdGUtY29uZmlnXFxcXGFwcGxpY2F0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8yREdJUy9Cd0dJU09uZU1hcC92aXRlLWNvbmZpZy9hcHBsaWNhdGlvbi50c1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5cbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcydcbmltcG9ydCB7IHJlYWRQYWNrYWdlSlNPTiB9IGZyb20gJ3BrZy10eXBlcydcbmltcG9ydCB7IHR5cGUgVXNlckNvbmZpZywgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5cbmltcG9ydCB7IGdlbmVyYXRlTW9kaWZ5VmFycyB9IGZyb20gJy4uL3NyYy91dGlscy9tb2RpZnlWYXJzJ1xuaW1wb3J0IHsgY29tbW9uQ29uZmlnIH0gZnJvbSAnLi9jb21tb24nXG5cbmltcG9ydCB7IGNyZWF0ZVBsdWdpbnMgfSBmcm9tICcuL3BsdWdpbnMnXG5cbmludGVyZmFjZSBEZWZpbmVPcHRpb25zIHtcbiAgb3ZlcnJpZGVzPzogVXNlckNvbmZpZ1xuICBvcHRpb25zPzoge1xuICAgIC8vXG4gIH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lQXBwbGljYXRpb25Db25maWcoZGVmaW5lT3B0aW9uczogRGVmaW5lT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHsgb3ZlcnJpZGVzID0ge30gfSA9IGRlZmluZU9wdGlvbnNcblxuICByZXR1cm4gZGVmaW5lQ29uZmlnKGFzeW5jICh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBwcm9jZXNzLmN3ZCgpXG4gICAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCdcbiAgICBjb25zdCB7IFZJVEVfQlVJTERfQ09NUFJFU1MgfSA9IGxvYWRFbnYoXG4gICAgICBtb2RlLFxuICAgICAgcm9vdCxcbiAgICApXG5cbiAgICBjb25zdCBwbHVnaW5zID0gYXdhaXQgY3JlYXRlUGx1Z2lucyh7IGlzQnVpbGQsIHJvb3QsIGNvbXByZXNzOiBWSVRFX0JVSUxEX0NPTVBSRVNTIH0pXG5cbiAgICBjb25zdCBkZWZpbmVEYXRhID0gYXdhaXQgY3JlYXRlRGVmaW5lRGF0YShyb290KVxuXG4gICAgY29uc3QgcGF0aFJlc29sdmUgPSAocGF0aG5hbWU6IHN0cmluZykgPT4gcmVzb2x2ZShyb290LCAnLicsIHBhdGhuYW1lKVxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgY29uc3QgYXBwbGljYXRpb25Db25maWc6IFVzZXJDb25maWcgPSB7XG4gICAgICAvLyBiYXNlOiBWSVRFX1BVQkxJQ19QQVRILFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczogW1xuICAgICAgICAgIC8vIEAveHh4eCA9PiBzcmMveHh4eFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpbmQ6IC9AXFwvLyxcbiAgICAgICAgICAgIHJlcGxhY2VtZW50OiBgJHtwYXRoUmVzb2x2ZSgnc3JjJyl9L2AsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvLyAjL3h4eHggPT4gdHlwZXMveHh4eFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpbmQ6IC8jXFwvLyxcbiAgICAgICAgICAgIHJlcGxhY2VtZW50OiBgJHtwYXRoUmVzb2x2ZSgndHlwZXMnKX0vYCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGRlZmluZTogZGVmaW5lRGF0YSxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICAgIGNzc1RhcmdldDogJ2Nocm9tZTgwJyxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgLy8gXHU1MTY1XHU1M0UzXHU2NTg3XHU0RUY2XHU1NDBEXG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogYGFzc2V0cy9lbnRyeS9bbmFtZV0tW2hhc2hdLSR7dGltZXN0YW1wfS5qc2AsXG4gICAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgICAgdnVlOiBbJ3Z1ZScsICdwaW5pYScsICd2dWUtcm91dGVyJ10sXG4gICAgICAgICAgICAgIGFudGQ6IFsnYW50LWRlc2lnbi12dWUnLCAnQGFudC1kZXNpZ24vaWNvbnMtdnVlJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY3NzOiB7XG4gICAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgICBsZXNzOiB7XG4gICAgICAgICAgICBtb2RpZnlWYXJzOiBnZW5lcmF0ZU1vZGlmeVZhcnMoKSxcbiAgICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGx1Z2lucyxcbiAgICB9XG5cbiAgICBjb25zdCBtZXJnZWRDb25maWcgPSBtZXJnZUNvbmZpZyhjb21tb25Db25maWcobW9kZSksIGFwcGxpY2F0aW9uQ29uZmlnKVxuXG4gICAgcmV0dXJuIG1lcmdlQ29uZmlnKG1lcmdlZENvbmZpZywgb3ZlcnJpZGVzKVxuICB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVEZWZpbmVEYXRhKHJvb3Q6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IHBrZ0pzb24gPSBhd2FpdCByZWFkUGFja2FnZUpTT04ocm9vdClcbiAgICBjb25zdCB7IGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzLCBuYW1lLCB2ZXJzaW9uIH0gPSBwa2dKc29uXG5cbiAgICBjb25zdCBfX0FQUF9JTkZPX18gPSB7XG4gICAgICBwa2c6IHsgZGVwZW5kZW5jaWVzLCBkZXZEZXBlbmRlbmNpZXMsIG5hbWUsIHZlcnNpb24gfSxcbiAgICAgIGxhc3RCdWlsZFRpbWU6IGRheWpzKCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyksXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBfX0FQUF9JTkZPX186IEpTT04uc3RyaW5naWZ5KF9fQVBQX0lORk9fXyksXG4gICAgfVxuICB9XG4gIGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7fVxuICB9XG59XG5cbmV4cG9ydCB7IGRlZmluZUFwcGxpY2F0aW9uQ29uZmlnIH1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcMkRHSVNcXFxcQndHSVNPbmVNYXBcXFxcc3JjXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFwyREdJU1xcXFxCd0dJU09uZU1hcFxcXFxzcmNcXFxcdXRpbHNcXFxcbW9kaWZ5VmFycy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovMkRHSVMvQndHSVNPbmVNYXAvc3JjL3V0aWxzL21vZGlmeVZhcnMudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICdAYW50LWRlc2lnbi9jb2xvcnMnXG5pbXBvcnQgeyB0aGVtZSB9IGZyb20gJ2FudC1kZXNpZ24tdnVlL2xpYidcbmltcG9ydCBjb252ZXJ0TGVnYWN5VG9rZW4gZnJvbSAnYW50LWRlc2lnbi12dWUvbGliL3RoZW1lL2NvbnZlcnRMZWdhY3lUb2tlbidcblxuY29uc3QgeyBkZWZhdWx0QWxnb3JpdGhtLCBkZWZhdWx0U2VlZCB9ID0gdGhlbWVcbmNvbnN0IHByaW1hcnlDb2xvciA9ICcjMDk2MGJkJ1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUFudENvbG9ycyhjb2xvcjogc3RyaW5nLCB0aGVtZTogJ2RlZmF1bHQnIHwgJ2RhcmsnID0gJ2RlZmF1bHQnKSB7XG4gIHJldHVybiBnZW5lcmF0ZShjb2xvciwge1xuICAgIHRoZW1lLFxuICB9KVxufVxuLyoqXG4gKiBsZXNzIGdsb2JhbCB2YXJpYWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVNb2RpZnlWYXJzKCkge1xuICBjb25zdCBwYWxldHRlcyA9IGdlbmVyYXRlQW50Q29sb3JzKHByaW1hcnlDb2xvcilcbiAgY29uc3QgcHJpbWFyeSA9IHBhbGV0dGVzWzVdXG4gIGNvbnN0IHByaW1hcnlDb2xvck9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XG5cbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDEwOyBpbmRleCsrKVxuICAgIHByaW1hcnlDb2xvck9ialtgcHJpbWFyeS0ke2luZGV4ICsgMX1gXSA9IHBhbGV0dGVzW2luZGV4XVxuXG4gIC8vIGNvbnN0IG1vZGlmeVZhcnMgPSBnZXRUaGVtZVZhcmlhYmxlcygpO1xuICBjb25zdCBtYXBUb2tlbiA9IGRlZmF1bHRBbGdvcml0aG0oZGVmYXVsdFNlZWQpXG4gIGNvbnN0IHYzVG9rZW4gPSBjb252ZXJ0TGVnYWN5VG9rZW4uZGVmYXVsdChtYXBUb2tlbilcbiAgcmV0dXJuIHtcbiAgICAuLi52M1Rva2VuLFxuICAgIC8vIHJlZmVyZW5jZTogIEF2b2lkIHJlcGVhdGVkIHJlZmVyZW5jZXNcbiAgICAnaGFjayc6IGB0cnVlOyBAaW1wb3J0IChyZWZlcmVuY2UpIFwiJHtyZXNvbHZlKCdzcmMvZGVzaWduL2NvbmZpZy5sZXNzJyl9XCI7YCxcbiAgICAncHJpbWFyeS1jb2xvcic6IHByaW1hcnksXG4gICAgLi4ucHJpbWFyeUNvbG9yT2JqLFxuICAgICdpbmZvLWNvbG9yJzogcHJpbWFyeSxcbiAgICAncHJvY2Vzc2luZy1jb2xvcic6IHByaW1hcnksXG4gICAgJ3N1Y2Nlc3MtY29sb3InOiAnIzU1RDE4NycsIC8vICBTdWNjZXNzIGNvbG9yXG4gICAgJ2Vycm9yLWNvbG9yJzogJyNFRDZGNkYnLCAvLyAgRmFsc2UgY29sb3JcbiAgICAnd2FybmluZy1jb2xvcic6ICcjRUZCRDQ3JywgLy8gICBXYXJuaW5nIGNvbG9yXG4gICAgJ2ZvbnQtc2l6ZS1iYXNlJzogJzE0cHgnLCAvLyAgTWFpbiBmb250IHNpemVcbiAgICAnYm9yZGVyLXJhZGl1cy1iYXNlJzogJzJweCcsIC8vICBDb21wb25lbnQvZmxvYXQgZmlsbGV0XG4gICAgJ2xpbmstY29sb3InOiBwcmltYXJ5LCAvLyAgIExpbmsgY29sb3JcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFwyREdJU1xcXFxCd0dJU09uZU1hcFxcXFx2aXRlLWNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcMkRHSVNcXFxcQndHSVNPbmVNYXBcXFxcdml0ZS1jb25maWdcXFxcY29tbW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8yREdJUy9Cd0dJU09uZU1hcC92aXRlLWNvbmZpZy9jb21tb24udHNcIjtpbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcblxuY29uc3QgY29tbW9uQ29uZmlnOiAobW9kZTogc3RyaW5nKSA9PiBVc2VyQ29uZmlnID0gbW9kZSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiB0cnVlLFxuICB9LFxuICBlc2J1aWxkOiB7XG4gICAgZHJvcDogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNTAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIFRPRE86IFByZXZlbnQgbWVtb3J5IG92ZXJmbG93XG4gICAgICBtYXhQYXJhbGxlbEZpbGVPcHM6IDMsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1Vub0NTUygpXSxcbn0pXG5cbmV4cG9ydCB7IGNvbW1vbkNvbmZpZyB9XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXDJER0lTXFxcXEJ3R0lTT25lTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXDJER0lTXFxcXEJ3R0lTT25lTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6LzJER0lTL0J3R0lTT25lTWFwL3ZpdGUtY29uZmlnL3BsdWdpbnMvaW5kZXgudHNcIjtpbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGNvbmZpZ0h0bWxQbHVnaW4gfSBmcm9tICcuL2h0bWwnXG5cbmludGVyZmFjZSBPcHRpb25zIHtcbiAgaXNCdWlsZDogYm9vbGVhblxuICByb290OiBzdHJpbmdcbiAgY29tcHJlc3M6IHN0cmluZ1xuICBlbmFibGVNb2NrPzogYm9vbGVhblxuICBlbmFibGVBbmFseXplPzogYm9vbGVhblxufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVQbHVnaW5zKHsgaXNCdWlsZCB9OiBPcHRpb25zKSB7XG4gIGNvbnN0IHZpdGVQbHVnaW5zOiAoUGx1Z2luT3B0aW9uIHwgUGx1Z2luT3B0aW9uW10pW10gPSBbdnVlKCksIHZ1ZUpzeCgpXVxuXG4gIC8vIHZpdGUtcGx1Z2luLWh0bWxcbiAgdml0ZVBsdWdpbnMucHVzaChjb25maWdIdG1sUGx1Z2luKHsgaXNCdWlsZCB9KSlcblxuICByZXR1cm4gdml0ZVBsdWdpbnNcbn1cblxuZXhwb3J0IHsgY3JlYXRlUGx1Z2lucyB9XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXDJER0lTXFxcXEJ3R0lTT25lTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXDJER0lTXFxcXEJ3R0lTT25lTWFwXFxcXHZpdGUtY29uZmlnXFxcXHBsdWdpbnNcXFxcaHRtbC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovMkRHSVMvQndHSVNPbmVNYXAvdml0ZS1jb25maWcvcGx1Z2lucy9odG1sLnRzXCI7LyoqXG4gKiBQbHVnaW4gdG8gbWluaW1pemUgYW5kIHVzZSBlanMgdGVtcGxhdGUgc3ludGF4IGluIGluZGV4Lmh0bWwuXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5uY3diL3ZpdGUtcGx1Z2luLWh0bWxcbiAqL1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWdIdG1sUGx1Z2luKHsgaXNCdWlsZCB9OiB7IGlzQnVpbGQ6IGJvb2xlYW4gfSkge1xuICBjb25zdCBodG1sUGx1Z2luOiBQbHVnaW5PcHRpb25bXSA9IGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgIG1pbmlmeTogaXNCdWlsZCxcbiAgfSlcbiAgcmV0dXJuIGh0bWxQbHVnaW5cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcMkRHSVNcXFxcQndHSVNPbmVNYXBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXDJER0lTXFxcXEJ3R0lTT25lTWFwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8yREdJUy9Cd0dJU09uZU1hcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUFwcGxpY2F0aW9uQ29uZmlnIH0gZnJvbSAnLi92aXRlLWNvbmZpZy9hcHBsaWNhdGlvbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQXBwbGljYXRpb25Db25maWcoe1xuICBvdmVycmlkZXM6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2VjaGFydHMvY29yZScsXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzL2NvbXBvbmVudHMnLFxuICAgICAgICAnZWNoYXJ0cy9yZW5kZXJlcnMnLFxuICAgICAgICAncXJjb2RlJyxcbiAgICAgICAgJ0BpY29uaWZ5L2ljb25pZnknLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJyxcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS9lbl9VUycsXG4gICAgICBdLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAnL25ldCc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xMzMuMTEwOjMzMzgyLycsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICAnL2dpcyc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xMzMuMTEwOjMzMzgyJyxcbiAgICAgICAgfSxcbiAgICAgICAgJy9id21lcy1ib290Lyc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xMzMuMTEwOjMzMzgyLycsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICAnL0J3TWFwJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEzMy4yMDc6MzMzOTEvYmlnZW1hcC5nbG9iYWxNYXAvJyxcbiAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL0J3TWFwLywgJycpLFxuICAgICAgICB9LFxuICAgICAgICAnL2J3bWVzJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEzMy4xMTA6MzMzODIvJyxcbiAgICAgICAgfSxcbiAgICAgICAgJy9Ib21lJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEzMy4xMTA6MzMzODIvJyxcbiAgICAgICAgfSxcbiAgICAgICAgJy9id3BvcnRhbCc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xMzMuMTEwOjMzMzgyJyxcbiAgICAgICAgfSxcbiAgICAgICAgJy9id29mZmljZSc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xMzMuMTEwOjMzMzgyJyxcbiAgICAgICAgfSxcbiAgICAgICAgJy9Cd0dJU09uZU1hcC9tcXR0Jzoge1xuICAgICAgICAgIHRhcmdldDogJ3dzOi8vMTkyLjE2OC4xMzMuMTEwOjMzMzgyJyxcbiAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL0J3R0lTT25lTWFwXFwvbXF0dC8sICcvbXF0dCcpLFxuICAgICAgICB9LFxuICAgICAgICAnL2Nhcy8nOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMTMzLjExMDozMzM4MicsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgICcvQndEZXZpY2VNYW5hZ2UnOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMTMzLjExMDozMzM4MicsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3BlbjogdHJ1ZSwgLy8gXHU5ODc5XHU3NkVFXHU1NDJGXHU1MkE4XHU1NDBFXHVGRjBDXHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXG4gICAgICB3YXJtdXA6IHtcbiAgICAgICAgY2xpZW50RmlsZXM6IFsnLi9pbmRleC5odG1sJywgJy4vc3JjL3t2aWV3cyxjb21wb25lbnRzfS8qJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUixTQUFTLFdBQUFBLGdCQUFlO0FBRWxULE9BQU8sV0FBVztBQUNsQixTQUFTLHVCQUF1QjtBQUNoQyxTQUEwQixjQUFjLFNBQVMsbUJBQW1COzs7QUNKZ04sU0FBUyxlQUFlO0FBQzVTLFNBQVMsZ0JBQWdCO0FBQ3pCLFNBQVMsYUFBYTtBQUN0QixPQUFPLHdCQUF3QjtBQUUvQixJQUFNLEVBQUUsa0JBQWtCLFlBQVksSUFBSTtBQUMxQyxJQUFNLGVBQWU7QUFFckIsU0FBUyxrQkFBa0IsT0FBZUMsU0FBNEIsV0FBVztBQUMvRSxTQUFPLFNBQVMsT0FBTztBQUFBLElBQ3JCLE9BQUFBO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUFJTyxTQUFTLHFCQUFxQjtBQUNuQyxRQUFNLFdBQVcsa0JBQWtCLFlBQVk7QUFDL0MsUUFBTSxVQUFVLFNBQVMsQ0FBQztBQUMxQixRQUFNLGtCQUEwQyxDQUFDO0FBRWpELFdBQVMsUUFBUSxHQUFHLFFBQVEsSUFBSTtBQUM5QixvQkFBZ0IsV0FBVyxRQUFRLENBQUMsRUFBRSxJQUFJLFNBQVMsS0FBSztBQUcxRCxRQUFNLFdBQVcsaUJBQWlCLFdBQVc7QUFDN0MsUUFBTSxVQUFVLG1CQUFtQixRQUFRLFFBQVE7QUFDbkQsU0FBTztBQUFBLElBQ0wsR0FBRztBQUFBO0FBQUEsSUFFSCxRQUFRLDhCQUE4QixRQUFRLHdCQUF3QixDQUFDO0FBQUEsSUFDdkUsaUJBQWlCO0FBQUEsSUFDakIsR0FBRztBQUFBLElBQ0gsY0FBYztBQUFBLElBQ2Qsb0JBQW9CO0FBQUEsSUFDcEIsaUJBQWlCO0FBQUE7QUFBQSxJQUNqQixlQUFlO0FBQUE7QUFBQSxJQUNmLGlCQUFpQjtBQUFBO0FBQUEsSUFDakIsa0JBQWtCO0FBQUE7QUFBQSxJQUNsQixzQkFBc0I7QUFBQTtBQUFBLElBQ3RCLGNBQWM7QUFBQTtBQUFBLEVBQ2hCO0FBQ0Y7OztBQzFDZ1IsT0FBTyxZQUFZO0FBR25TLElBQU0sZUFBNkMsV0FBUztBQUFBLEVBQzFELFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNLFNBQVMsZUFBZSxDQUFDLFdBQVcsVUFBVSxJQUFJLENBQUM7QUFBQSxFQUMzRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsc0JBQXNCO0FBQUEsSUFDdEIsdUJBQXVCO0FBQUEsSUFDdkIsZUFBZTtBQUFBO0FBQUEsTUFFYixvQkFBb0I7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUM7QUFDcEI7OztBQ25Cd1MsT0FBTyxTQUFTO0FBQ3hULE9BQU8sWUFBWTs7O0FDSW5CLFNBQVMsd0JBQXdCO0FBRTFCLFNBQVMsaUJBQWlCLEVBQUUsUUFBUSxHQUF5QjtBQUNsRSxRQUFNLGFBQTZCLGlCQUFpQjtBQUFBLElBQ2xELFFBQVE7QUFBQSxFQUNWLENBQUM7QUFDRCxTQUFPO0FBQ1Q7OztBRENBLGVBQWUsY0FBYyxFQUFFLFFBQVEsR0FBWTtBQUNqRCxRQUFNLGNBQWlELENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUd2RSxjQUFZLEtBQUssaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFOUMsU0FBTztBQUNUOzs7QUhGQSxTQUFTLHdCQUF3QixnQkFBK0IsQ0FBQyxHQUFHO0FBQ2xFLFFBQU0sRUFBRSxZQUFZLENBQUMsRUFBRSxJQUFJO0FBRTNCLFNBQU8sYUFBYSxPQUFPLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDL0MsVUFBTSxPQUFPLFFBQVEsSUFBSTtBQUN6QixVQUFNLFVBQVUsWUFBWTtBQUM1QixVQUFNLEVBQUUsb0JBQW9CLElBQUk7QUFBQSxNQUM5QjtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBRUEsVUFBTSxVQUFVLE1BQU0sY0FBYyxFQUFFLFNBQVMsTUFBTSxVQUFVLG9CQUFvQixDQUFDO0FBRXBGLFVBQU0sYUFBYSxNQUFNLGlCQUFpQixJQUFJO0FBRTlDLFVBQU0sY0FBYyxDQUFDLGFBQXFCQyxTQUFRLE1BQU0sS0FBSyxRQUFRO0FBQ3JFLFVBQU0sYUFBWSxvQkFBSSxLQUFLLEdBQUUsUUFBUTtBQUNyQyxVQUFNLG9CQUFnQztBQUFBO0FBQUEsTUFFcEMsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBO0FBQUEsVUFFTDtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sYUFBYSxHQUFHLFlBQVksS0FBSyxDQUFDO0FBQUEsVUFDcEM7QUFBQTtBQUFBLFVBRUE7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLGFBQWEsR0FBRyxZQUFZLE9BQU8sQ0FBQztBQUFBLFVBQ3RDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxNQUNSLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLFdBQVc7QUFBQSxRQUNYLGVBQWU7QUFBQSxVQUNiLFFBQVE7QUFBQTtBQUFBLFlBRU4sZ0JBQWdCLDhCQUE4QixTQUFTO0FBQUEsWUFDdkQsY0FBYztBQUFBLGNBQ1osS0FBSyxDQUFDLE9BQU8sU0FBUyxZQUFZO0FBQUEsY0FDbEMsTUFBTSxDQUFDLGtCQUFrQix1QkFBdUI7QUFBQSxZQUNsRDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSztBQUFBLFFBQ0gscUJBQXFCO0FBQUEsVUFDbkIsTUFBTTtBQUFBLFlBQ0osWUFBWSxtQkFBbUI7QUFBQSxZQUMvQixtQkFBbUI7QUFBQSxVQUNyQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFFQSxVQUFNLGVBQWUsWUFBWSxhQUFhLElBQUksR0FBRyxpQkFBaUI7QUFFdEUsV0FBTyxZQUFZLGNBQWMsU0FBUztBQUFBLEVBQzVDLENBQUM7QUFDSDtBQUVBLGVBQWUsaUJBQWlCLE1BQWM7QUFDNUMsTUFBSTtBQUNGLFVBQU0sVUFBVSxNQUFNLGdCQUFnQixJQUFJO0FBQzFDLFVBQU0sRUFBRSxjQUFjLGlCQUFpQixNQUFNLFFBQVEsSUFBSTtBQUV6RCxVQUFNLGVBQWU7QUFBQSxNQUNuQixLQUFLLEVBQUUsY0FBYyxpQkFBaUIsTUFBTSxRQUFRO0FBQUEsTUFDcEQsZUFBZSxNQUFNLEVBQUUsT0FBTyxxQkFBcUI7QUFBQSxJQUNyRDtBQUNBLFdBQU87QUFBQSxNQUNMLGNBQWMsS0FBSyxVQUFVLFlBQVk7QUFBQSxJQUMzQztBQUFBLEVBQ0YsU0FDTyxPQUFPO0FBQ1osV0FBTyxDQUFDO0FBQUEsRUFDVjtBQUNGOzs7QUtqR0EsSUFBTyxzQkFBUSx3QkFBd0I7QUFBQSxFQUNyQyxXQUFXO0FBQUEsSUFDVCxjQUFjO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFFBQ2hCO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsUUFDaEI7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUNSLFFBQVE7QUFBQSxVQUNSLFNBQVMsVUFBUSxLQUFLLFFBQVEsWUFBWSxFQUFFO0FBQUEsUUFDOUM7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUNSLFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0EsYUFBYTtBQUFBLFVBQ1gsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLGFBQWE7QUFBQSxVQUNYLFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQSxxQkFBcUI7QUFBQSxVQUNuQixRQUFRO0FBQUEsVUFDUixJQUFJO0FBQUEsVUFDSixTQUFTLFVBQVEsS0FBSyxRQUFRLHdCQUF3QixPQUFPO0FBQUEsUUFDL0Q7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNQLFFBQVE7QUFBQSxVQUNSLElBQUk7QUFBQSxRQUNOO0FBQUEsUUFDQSxtQkFBbUI7QUFBQSxVQUNqQixRQUFRO0FBQUEsVUFDUixJQUFJO0FBQUEsUUFDTjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sYUFBYSxDQUFDLGdCQUFnQiw0QkFBNEI7QUFBQSxNQUM1RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJ0aGVtZSIsICJyZXNvbHZlIl0KfQo=
