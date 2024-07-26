<script lang="ts" setup>
import { useMenuHide } from '../src/hooks/useMenuHide'
import LeftPanel from './leftPanel/LeftPanel.vue'
import AppRightTop from './appRightTop/AppRightTop.vue'

const { getMenuHide } = useMenuHide()
</script>

<template>
  <div v-show="getMenuHide" class="menu">
    <LeftPanel />
    <AppRightTop />
  </div>
</template>
