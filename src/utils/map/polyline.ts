import * as L from 'leaflet'
import { reactive, toRaw, unref } from 'vue'
import { marker, svgIcon } from './marker'
import type { MenuSub } from '@/components/Menu/src/types/menu'
import { useMapSetting } from '@/hooks/web/map/useMap'

export const polylineFeatureGroup = L.featureGroup()

export const polylineGroupMap = reactive(new Map<string, L.FeatureGroup>())

export interface MPathOptions extends L.PathOptions {
  key?: string
  coalbed?: string
  data: any
}

export function polyline(
  latLngs: L.LatLngExpression[] | L.LatLngExpression[][],
  options?: MPathOptions,
) {
  return L.polyline(latLngs, options)
}

export function addLineLayer(data: any, menuSub: MenuSub) {
  console.log(data, menuSub)
  const key = menuSub.layer || menuSub.markType
  const { map: leafletMap } = useMapSetting()
  const map = toRaw(unref(leafletMap))

  const layerValue = polylineGroupMap.get(key!)
  if (layerValue) {
    layerValue.clearLayers()
    map.removeLayer(layerValue as L.FeatureGroup)
    polylineGroupMap.delete(key!)
  }

  const lines: any[] = []
  const makers: any[] = []
  data.forEach((e: any) => {
    const layer = { ...e, menuSub }
    const { MarkType } = e
    if (MarkType && MarkType.coordinates) {
      if (MarkType.type[0] === 'Line') {
        lines.push(layer)
      }
      else if (MarkType.type[0] === 'Marker') {
        makers.push(layer)
      }
      else {
        console.log(layer)
      }
    }
  })
  const lineLayers = lines.map((line) => {
    const { MarkType, coalbed, weight, color } = line
    return polyline(
      MarkType.coordinates,
      {
        data: line,
        key: line[menuSub.tableKey!],
        coalbed,
        weight,
        color,
      },
    )
  })
  const markerLayers = makers.map((maker) => {
    const { MarkType, icon, coalbed } = maker
    const markconfig = icon.split('.')[0]
    console.log(markconfig)

    const _svgIcon = svgIcon({ markconfig })
    return marker(
      MarkType.coordinates[0],
      {
        icon: _svgIcon,
        data: maker,
        coalbed,
        key: maker[menuSub.tableKey!],
      },
    )
  })
  const featureGroup = L.featureGroup([...lineLayers, ...markerLayers]).addTo(map)
  polylineGroupMap.set(key!, featureGroup)
}

export function clearLayers() {
  const { map: leafletMap } = useMapSetting()
  const map = toRaw(unref(leafletMap))
  polylineGroupMap.forEach((layer) => {
    layer.clearLayers()
    map.removeLayer(layer as L.FeatureGroup)
  })
  polylineGroupMap.clear()
}
