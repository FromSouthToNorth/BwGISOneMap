<script lang="ts" setup>
// import { createApp } from 'vue'
import { leafletMap } from '@/components/Map'
import { BasicMenu } from '@/components/Menu'

// const dom = document.createDocumentFragment()
// console.log(dom)
// const menu = createApp(BasicMenu).mount(dom)
// console.log(menu.$el)
</script>

<template>
  <BasicMenu />
  <leafletMap />
</template>
