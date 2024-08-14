import * as L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { unref, watch } from 'vue'

import { showSatellite, tileLayersGroup } from './tileLayer'
import { zoom as onZoom } from './event'
import { cadLayersGroup } from './cadsLayer'
import { markerFeatureGroup } from './marker'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'

const mapStore = useMapStore()

export function createMap(id: string) {
  const { mineInfo } = useUserSetting()
  watch(() => unref(mineInfo), (mineInfo) => {
    const { show_map, show_cad, centerB, centerL, max_zoom, no_show_satellitemap } = mineInfo
    const center: LatLngExpression = [centerB, centerL]
    const maxZoom = max_zoom || 25
    const minZoom = no_show_satellitemap ? show_cad : show_map
    const map = L.map(id, {
      center,
      zoom: show_map,
      minZoom,
      maxZoom,
      attributionControl: false,
      zoomControl: false,
    })

    map.on('zoom', onZoom)

    const hash = behaviorHash({ map, mineInfo })
    hash()
    map.on('moveend', hash.updateHashIfNeeded)

    tileLayersGroup.addTo(map)

    cadLayersGroup.addTo(map)

    markerFeatureGroup.addTo(map)

    if (!no_show_satellitemap) {
      showSatellite()
    }
    mapStore.setMap(map)
  })
}
