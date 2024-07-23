import { computed } from 'vue'

import { useMapStore } from '@/store/modules/map'

export function useMapSetting() {
  const mapStore = useMapStore()

  const map = computed(() => mapStore.getMap)

  return {
    map,
  }
}
