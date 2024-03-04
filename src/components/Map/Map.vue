<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue'
import { createMap } from '@/utils/map/index'

const mapContainer = ref()
const map = ref()

onMounted(() => {
  map.value = createMap(unref(mapContainer))
})
</script>

<template>
  <div id="map-container" ref="mapContainer" />
</template>
