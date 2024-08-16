import * as L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { unref, watch } from 'vue'

import { showSatellite, tileLayersGroup } from './tileLayer'
import { zoom as onZoom } from './event'
import { cadLayersGroup } from './cadsLayer'
import { addMarkerLayer, markerFeatureGroup } from './marker'
import { polygonFeatureGroup } from './polygon'
import { polylineFeatureGroup } from './polyline'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import type { MenuSub } from '@/components/Menu/src/types/menu'

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
    polygonFeatureGroup.addTo(map)
    polylineFeatureGroup.addTo(map)

    if (!no_show_satellitemap) {
      showSatellite()
    }
    mapStore.setMap(map)

    return map
  })
}

export function setLayer(
  data: any,
  menuSub: MenuSub,
  markconfig: any,
) {
  const { markType } = menuSub
  switch (markType) {
    case 'AO1':
      console.log('polygon')
      break
    case 'B08':
    case 'B46':
      console.log('polyline')
      break
    default:
      console.log('maker')
      addMarkerLayer(data, menuSub, markconfig)
  }
}
