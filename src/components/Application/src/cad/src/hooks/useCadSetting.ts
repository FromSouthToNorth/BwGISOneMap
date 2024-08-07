import { computed, ref, toRaw, unref } from 'vue'
import type { CadType, CoalSeam } from '@/utils/mqtt/types'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { useMapSetting } from '@/hooks/web/map/useMap'

const cadRef = ref<CadType[]>([])

const coalSeamRef = ref<CoalSeam[]>([])

export function useCadSetting() {
  function setCad(cad: CadType[]) {
    cadRef.value = cad
    const { mineInfo } = useUserSetting()
    const { map } = useMapSetting()
    console.log('useCadSetting map: ', unref(map))
    const { no_show_satellitemap, show_cad } = unref(mineInfo)
    if (no_show_satellitemap)
      toRaw(unref(map)).setZoom(show_cad + 1)
  }

  const getCad = computed(() => unref(cadRef))

  const getDefaultCad = computed(() => unref(cadRef)[0].cads[0])

  function setCoalSeam(coalSeam: CoalSeam[]) {
    coalSeamRef.value = coalSeam
  }

  const getCoalSeam = computed(() => unref(coalSeamRef))

  return {
    setCad,
    getCad,
    getDefaultCad,
    setCoalSeam,
    getCoalSeam,
  }
}
