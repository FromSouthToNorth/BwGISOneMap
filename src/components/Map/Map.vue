<script lang="ts" setup>
import { onMounted } from 'vue'
import { createMap } from '@/utils/map/index'

onMounted(() => {
  createMap('map-container')
})
</script>

<template>
  <div id="map-container" />
</template>
