import * as L from 'leaflet'
import type { TileLayer } from 'leaflet'
import { watch } from 'vue'
import { tileLayers } from './tileLayer'
import { zoom } from './event'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'
import { mineInfo } from '@/hooks/web/sys/useUser'

const mapStore = useMapStore()

export const tileLayersGroup: TileLayer[] = []

export function createMap(id: string) {
  watch(() => mineInfo.value, async (mineInfo) => {
    const { show_map, centerB, centerL } = mineInfo
    const map = L.map(id, {
      zoom: show_map,
      center: [centerB, centerL],
    })
    const hash = behaviorHash({ map, mineInfo })
    hash()
    map.on('moveend', () => {
      hash.updateHashIfNeeded()
    })
    map.on('zoom', zoom)
    tileLayers.forEach(({ tileUrl, options }) => {
      const tileLayer = L.tileLayer(tileUrl, options)
        .addTo(map)
        .on('tileerror', (e) => {
          console.log(e)
        })
      tileLayersGroup.push(tileLayer)
    })

    mapStore.setMap(map)
  })
}
