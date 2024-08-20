import * as L from 'leaflet'
import type { LatLngExpression, Layer, LayerGroup } from 'leaflet'
import { toRaw, unref, watch } from 'vue'

import { isArray } from '../is'
import { showSatellite, tileLayersGroup } from './tileLayer'
import { zoom as onZoom } from './event'
import { cadLayersGroup } from './cadsLayer'
import {
  addMarkerLayer,
  clearMarkerclusterMap,
  markerFeatureGroup,
  markerclusterMap,
} from './marker'
import {
  addPolygonLayer,
  polygonFeatureGroup,
  polygonGroupMap,
} from './polygon'
import {
  addLineLayer,
  polylineFeatureGroup,
  polylineGroupMap,
} from './polyline'
import { behaviorHash } from '@/hooks/web/map/useHash'

import { useMapSetting } from '@/hooks/web/map/useMap'
import { useMapStore } from '@/store/modules/map'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import type { MenuSub } from '@/components/Menu/src/types/menu'
import { useMenuSub, useTool } from '@/components/Menu'

const { getActiveMenuSub } = useMenuSub()
const { getIsLayerOverlay } = useTool()

export function createMap(id: string) {
  const { mineInfo } = useUserSetting()
  watch(mineInfo, (mineInfo) => {
    const mapStore = useMapStore()
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

export function isLayerOverlay() {
  if (!unref(getIsLayerOverlay)) {
    clearLayers()
  }
}

export function setLayer(
  data: any,
  menuSub: MenuSub,
  markconfig: any,
) {
  isLayerOverlay()
  const { markType } = menuSub
  switch (markType) {
    case 'AO1':
      addPolygonLayer(data, menuSub)
      console.log('polygon')
      break
    case 'B08':
    case 'B46':
      addLineLayer(data, menuSub)
      console.log('polyline')
      break
    default:
      console.log('maker')
      addMarkerLayer(data, menuSub, isArray(markconfig) ? markconfig[0].value : null)
  }
}

export function activeMenuSubByExcludeLayers() {
  const menuSub = unref(getActiveMenuSub)
  if (menuSub) {
    const { layer, markType } = menuSub
    const key = layer || markType!
    const layerMaps = [markerclusterMap, polylineGroupMap, polygonGroupMap]
    layerMaps.forEach((map) => {
      keyByExcludeLayers(key, map as Map<string, L.FeatureGroup>)
    })
  }
}

export function keyByExcludeLayers(key: string, layerMap: Map<string, LayerGroup>) {
  const { map } = useMapSetting()
  layerMap.forEach((value, _key) => {
    if (_key !== key) {
      value.clearLayers()
      toRaw(unref(map)).removeLayer(value)
    }
  })
}

export function clearLayers() {
  const { map: leafletMap } = useMapSetting()
  const map = toRaw(unref(leafletMap))
  markerclusterMap.forEach((e) => {
    e.clearLayers()
    map.removeLayer(e)
  })
  polylineGroupMap.forEach((e) => {
    e.clearLayers()
  })
  polygonGroupMap.forEach((e) => {
    e.clearLayers()
  })
}
