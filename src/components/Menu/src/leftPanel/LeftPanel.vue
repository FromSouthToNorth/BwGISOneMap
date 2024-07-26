<script lang="ts" setup>
import { ref } from 'vue'
import { useMenuDrop } from '../hooks/useMenuDrop'
import MenuContainer from './src/MenuContainer.vue'
import CardTabs from './src/CardTabs.vue'
import { AppSearch } from '@/components/Application'
import {
  SlideXReverseTransition,
  SlideYTransition,
} from '@/components/Transtition'

const { getMenuDrop } = useMenuDrop()

const menuContainerHide = ref(true)

function menuClick() {
  menuContainerHide.value = !menuContainerHide.value
}
</script>

<template>
  <component :is="SlideYTransition">
    <div v-show="getMenuDrop" id="left-panel">
      <AppSearch />
      <component :is="SlideXReverseTransition">
        <MenuContainer v-show="menuContainerHide" @click="menuClick" />
      </component>
      <component :is="SlideXReverseTransition">
        <CardTabs v-show="!menuContainerHide" @click="menuClick" />
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
