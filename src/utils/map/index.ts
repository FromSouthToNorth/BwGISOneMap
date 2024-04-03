import * as L from 'leaflet'
import type { LatLngExpression, TileLayer } from 'leaflet'
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
    const { show_map, centerB, centerL, no_show_satellitemap, max_zoom, show_cad, is_show_mineboundary } = mineInfo
    const center: LatLngExpression = [centerB, centerL]

    const map = L.map(id, {
      zoom: show_map,
      center,
      maxZoom: max_zoom || 25,
    })
    if (!is_show_mineboundary)
      console.warn('不显矿井边界!!!')

    if (no_show_satellitemap) {
      console.warn('不显示卫星图!!!')
      map.setView([centerB, centerL], show_cad)
    }
    else {
      tileLayers.forEach(({ tileUrl, options }) => {
        const tileLayer = L.tileLayer(tileUrl, options)
          .addTo(map)
          .on('tileerror', (e) => {
            console.error(e)
          })
        tileLayersGroup.push(tileLayer)
      })
    }

    const hash = behaviorHash({ map, mineInfo })
    hash()
    map.on('moveend', hash.updateHashIfNeeded)

    map.on('zoom', zoom)

    mapStore.setMap(map)
  })
}
