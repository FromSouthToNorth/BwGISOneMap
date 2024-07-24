<script lang="ts" setup>
import MenuContainer from './src/MenuContainer.vue'
import { AppSearch } from '@/components/Application'
import {
  SlideYTransition,
} from '@/components/Transtition/index'

import { useMenuSetting } from '@/hooks/setting/useMenuSetting'

const { menuDrop } = useMenuSetting()
</script>

<template>
  <component :is="SlideYTransition">
    <div v-show="menuDrop" id="left-panel">
      <AppSearch />
      <MenuContainer />
    </div>
  </component>
</template>

<style lang="less" scoped>
#left-panel {
  position: absolute;
  left: 20px;
  top: 20px;
  overflow: hidden;
  z-index: 500;
  min-width: 600px;
}
</style>
