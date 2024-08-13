<script lang="ts" setup>
import { ref } from 'vue'
import { useMenuDrop, useMenuSub } from '../../'
import type { MenuItem } from '../types/menu'
import MenuContainer from './src/MenuContainer.vue'
import CardTabs from './src/CardTabs.vue'
import { AppSearch } from '@/components/Application'
import {
  SlideXReverseTransition,
  SlideYTransition,
} from '@/components/Transtition'
import {
  publishOneMapSubMenu,
} from '@/utils/mqtt/publish'

const { getMenuDrop } = useMenuDrop()
const { menuSubClick } = useMenuSub()

const menuContainerHide = ref(true)
const activeTabKey = ref('')

function menuClick(menu?: MenuItem) {
  if (menu) {
    const { id } = menu
    activeTabKey.value = id
    publishOneMapSubMenu(menu)
  }
  menuContainerHide.value = !menu
}
</script>

<template>
  <component :is="SlideYTransition">
    <div
      v-show="getMenuDrop"
      id="left-panel"
    >
      <AppSearch />
      <component
        :is="SlideXReverseTransition"
      >
        <MenuContainer
          v-show="menuContainerHide"
          @click="menuClick"
        />
      </component>
      <component
        :is="SlideXReverseTransition"
      >
        <CardTabs
          v-show="!menuContainerHide"
          :active-tab-key="activeTabKey"
          @click="menuClick"
          @sub-click="menuSubClick"
        />
      </component>
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
  width: 660px;
}
</style>
