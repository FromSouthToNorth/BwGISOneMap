<script setup lang="ts">
import { computed } from 'vue'
import { ConfigProvider } from 'ant-design-vue/lib'

const themeConfig = computed(() =>
  Object.assign(
    {
      token: {
        colorPrimary: '#0960bd',
        colorSuccess: '#55D187',
        colorWarning: '#EFBD47',
        colorError: '#ED6F6F',
        colorInfo: '#0960bd',
      },
    },
    {},
  ),
)
</script>

<template>
  <ConfigProvider :theme="themeConfig">
    <RouterView />
  </ConfigProvider>
</template>

<style scoped>
</style>
