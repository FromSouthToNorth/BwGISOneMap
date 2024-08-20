import { computed, ref, unref } from 'vue'
import { activeMenuSubByExcludeLayers } from '@/utils/map'
import { clusterToFeature, featureToCluster } from '@/utils/map/marker'

const isAggSwitchRef = ref(true)
const isLayerOverlayRef = ref(false)

export function useTool() {
  function setIsAggSwitch(isAggSwitch: boolean) {
    isAggSwitchRef.value = isAggSwitch
    // eslint-disable-next-line ts/no-unused-expressions
    isAggSwitchRef.value ? featureToCluster() : clusterToFeature()
  }
  const getIsAggSwitch = computed(() => unref(isAggSwitchRef))

  function setIsLayerOverlay(isLayerOverlay: boolean) {
    isLayerOverlayRef.value = isLayerOverlay
    // eslint-disable-next-line ts/no-unused-expressions
    !isLayerOverlayRef.value && activeMenuSubByExcludeLayers()
  }
  const getIsLayerOverlay = computed(() => unref(isLayerOverlayRef))

  return {
    setIsAggSwitch,
    getIsAggSwitch,
    setIsLayerOverlay,
    getIsLayerOverlay,
  }
}
