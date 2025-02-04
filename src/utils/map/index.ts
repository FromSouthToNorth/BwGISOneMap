import * as L from 'leaflet'
import type { LatLngExpression, LayerGroup } from 'leaflet'
import { type Ref, ref, toRaw, unref, watch } from 'vue'

import { isArray } from '../is'
import { showSatellite, tileLayersGroup } from './tileLayer'
import { onClickMap, zoom as onZoom } from './event'
import { cadLayersGroup } from './cadsLayer'
import {
  addMarkerLayer,
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
import { activeFeatureGroup, clearActiveLayers } from './activeLayer'
import { clearPopLayer, popup, popupFeatureGroup } from './popup'
import { behaviorHash } from '@/hooks/web/map/useHash'

import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import type { MenuSub } from '@/components/Menu/src/types/menu'
import { useMenuSub, useTool } from '@/components/Menu'
import { useCadSetting } from '@/components/Application/src/cad/src/hooks/useCadSetting'

const { mineInfo } = useUserSetting()
const { getActiveMenuSub } = useMenuSub()
const { getIsLayerOverlay } = useTool()
const { getCad, loadDefaultCad } = useCadSetting()

export const leafletMap: Ref<L.Map | null> = ref(null)

export function createMap(id: string) {
  watch(getCad, () => {
    const { show_map, show_cad, centerB, centerL, max_zoom, no_show_satellitemap } = unref(mineInfo)
    const center: LatLngExpression = [centerB, centerL]
    const maxZoom = max_zoom || 25
    const minZoom = no_show_satellitemap ? show_cad : show_map
    leafletMap.value = L.map(id, {
      center,
      zoom: show_map,
      minZoom,
      maxZoom,
      attributionControl: false,
      zoomControl: false,
    })

    toRaw(unref(leafletMap)!).on('zoom', onZoom)

    const hash = behaviorHash({ map: toRaw(unref(leafletMap)!), mineInfo })
    hash()
    toRaw(unref(leafletMap)!).on('moveend', hash.updateHashIfNeeded)
    toRaw(unref(leafletMap)!).on('click', onClickMap)

    tileLayersGroup.addTo(toRaw(unref(leafletMap)!))
    cadLayersGroup.addTo(toRaw(unref(leafletMap)!))
    markerFeatureGroup.addTo(toRaw(unref(leafletMap)!))
    polygonFeatureGroup.addTo(toRaw(unref(leafletMap)!))
    polylineFeatureGroup.addTo(toRaw(unref(leafletMap)!))
    activeFeatureGroup.addTo(toRaw(unref(leafletMap)!))
    popupFeatureGroup.addTo(toRaw(unref(leafletMap)!))

    if (!no_show_satellitemap) {
      showSatellite()
    }
    else {
      loadDefaultCad()
    }
    return leafletMap
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
) {
  isLayerOverlay()
  const { markType } = menuSub
  switch (markType) {
    case 'A01':
      addPolygonLayer(data, menuSub)
      break
    case 'B08':
    case 'B46':
      addLineLayer(data, menuSub)
      break
    default:
      addMarkerLayer(data, menuSub)
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
  layerMap.forEach((value, _key) => {
    if (_key !== key) {
      toRaw(value).clearLayers()
      toRaw(unref(leafletMap)!).removeLayer(toRaw(value))
    }
  })
}

export function clearLayers() {
  const layers = [markerclusterMap, polylineGroupMap, polygonGroupMap]
  for (const layer of layers) {
    if (layer.size) {
      layer.forEach((e) => {
        toRaw(e).clearLayers()
        toRaw(unref(leafletMap)!).removeLayer(toRaw(e) as L.FeatureGroup)
      })
    }
    layer.clear()
  }
  clearActiveLayers()
  clearPopLayer()
}

export function tryInsert(
  latLng: L.LatLngExpression | L.LatLngExpression[] | L.LatLngExpression[][],
) {
  if (Array.isArray(latLng) && latLng.length) {
    return clipPolygon(latLng as L.LatLngExpression[]).length > 0
  }
  else {
    return toRaw(unref(leafletMap)!).getBounds().contains(latLng as L.LatLngExpression)
  }
}

export function clipPolygon(latLngs: L.LatLngExpression[]) {
  const points = latLngsToPoints(latLngs)
  return L.PolyUtil.clipPolygon(points, bounds())
}

/**
 *
 * @param {*} latLng
 */
export function latLngToPoint(latLng: L.LatLngExpression) {
  return toRaw(unref(leafletMap)!).latLngToLayerPoint(latLng)
}

/**
 *
 * @param {*} latLngs
 */
export function latLngsToPoints(latLngs: L.LatLngExpression[]) {
  return latLngs.map((latLng) => {
    return latLngToPoint(latLng)
  })
}

export function bounds() {
  const bounds = toRaw(unref(leafletMap)!).getBounds()
  return L.bounds(latLngToPoint(bounds.getNorthEast()), latLngToPoint(bounds.getSouthWest()))
}

export function isLatLng(data: any) {
  const { B, L } = data
  return B && L
}

export function isLatLngs(data: any) {
  const { MarkType } = data
  return (MarkType && isArray(MarkType.coordinates) && MarkType.coordinates.length > 1)
}

export function openPopup(data: any, openModal?: any) {
  if (!isLatLng(data) && !isLatLngs(data) && openModal) {
    openModal()
  }
  else {
    popup(data)
  }
}
