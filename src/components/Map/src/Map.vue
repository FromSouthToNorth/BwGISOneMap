<script lang="ts" setup>
import {
  onBeforeUnmount,
  onDeactivated,
  ref,
  unref,
} from 'vue'
import { createMap } from '@/utils/map'
import { onMountedOrActivated } from '@/hooks/src/onMountedOrActivated'

const mapContainerRef = ref()
const mapRef = ref()

function init() {
  if (mapRef.value) {
    mapRef.value.remove()
    const mapInstance = unref(mapContainerRef)
    mapInstance?.destroy?.()
  }
  mapRef.value = createMap(unref(mapContainerRef))
}
// onMounted(() => {
//   init()
// })

function destroy() {
  const mapInstance = unref(mapContainerRef)
  if (!mapContainerRef.value)
    return
  try {
    mapRef.value.remove()
    mapInstance?.destroy?.()
  }
  catch (error) {
    //
  }
  mapInstance.value = null
}

onMountedOrActivated(init)

onBeforeUnmount(destroy)
onDeactivated(destroy)
</script>

<template>
  <div id="map-container" ref="mapContainerRef" />
</template>
