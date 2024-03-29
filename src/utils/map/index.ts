import * as L from 'leaflet'
import { watch } from 'vue'
import { tileLayers } from './tileLayer'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'
import { mineInfo } from '@/hooks/web/sys/useUser'

const mapStore = useMapStore()

export function createMap(id: string) {
  watch(() => mineInfo.value, async (mineInfo) => {
    const { show_map, centerB, centerL } = mineInfo
    const map = L.map(id, {
      zoom: show_map,
      center: [centerB, centerL],
    })
    tileLayers.forEach(({ tileUrl, options }) => {
      L.tileLayer(tileUrl, options).addTo(map)
    })
    const hash = behaviorHash({ map, mineInfo })
    hash()
    mapStore.setMap(map)
  })
}
