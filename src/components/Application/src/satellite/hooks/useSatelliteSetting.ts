import { computed, ref, unref } from 'vue'

const isSatelliteRef = ref(false)

export function useSatelliteSetting() {
  const getIsSatellite = computed(() => unref(isSatelliteRef))

  function setIsSatellite(isSatellite: boolean) {
    isSatelliteRef.value = isSatellite
  }

  return {
    setIsSatellite,
    getIsSatellite,
  }
}
