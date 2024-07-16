import { computed } from 'vue'

import { useMapStore } from '@/store/modules/map'

export function useMapSetting() {
  const mapStore = useMapStore()

  const map = computed(() => mapStore.getMap)
  const cads = computed(() => mapStore.getCads)
  const coalSeam = computed(() => mapStore.getCoalSeam)

  return {
    map,
    cads,
    coalSeam,
  }
}
