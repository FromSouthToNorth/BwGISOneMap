<script lang="ts" setup>
import HideButton from './src/HideButton.vue'
import {
  SlideYTransition,
} from '@/components/Transtition/index'

import { Cad, MineName, Satellite, User } from '@/components/Application'

import { useMenuSetting } from '@/hooks/setting/useMenuSetting'

const { menuDrop } = useMenuSetting()
</script>

<template>
  <div id="app-right-top">
    <component :is="SlideYTransition">
      <div v-show="menuDrop" class="app-right-top-menu">
        <MineName />
        <Satellite />
        <Cad />
        <User />
      </div>
    </component>
    <HideButton />
  </div>
</template>

<style lang="less" scoped>
#app-right-top {
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 500;
  display: flex;

}

.app-right-top-menu {
  display: flex;
  align-items: center;
  overflow: hidden;
}
</style>
