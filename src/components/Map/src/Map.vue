<script lang="ts" setup>
import {
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  unref,
} from 'vue'
import { createMap } from '@/utils/map'
import { onMountedOrActivated } from '@/hooks/src/onMountedOrActivated'

const mapContainerRef = ref()

function init() {
  createMap(unref(mapContainerRef))
}
// onMounted(() => {
//   init()
// })

function destroy() {
  const mapInstance = unref(mapContainerRef)
  if (!mapContainerRef.value)
    return
  try {
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
