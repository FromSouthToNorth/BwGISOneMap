<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue'
import { createMap } from '@/utils/map'

const mapContainer = ref()

onMounted(() => {
  createMap(unref(mapContainer))
})
</script>

<template>
  <div id="map-container" ref="mapContainer" />
</template>
