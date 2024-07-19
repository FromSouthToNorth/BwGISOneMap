<script lang="ts" setup>
import LeftPanel from './leftPanel/LeftPanel.vue'
import AppRightTop from './appRightTop/AppRightTop.vue'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'

const { menuHide } = useMenuSetting()
</script>

<template>
  <div v-show="menuHide" class="menu">
    <LeftPanel />
    <AppRightTop />
  </div>
</template>
