import * as L from 'leaflet'
import { reactive, toRaw, unref } from 'vue'
import { marker, svgIcon } from './marker'
import { leafletMap } from '.'
import type { MenuSub } from '@/components/Menu/src/types/menu'

export const polylineFeatureGroup = L.featureGroup()

export const polylineGroupMap = reactive(new Map<string, L.FeatureGroup>())

export interface MPathOptions extends L.PathOptions {
  key?: string
  coalbed?: string
  data: any
  menuSub?: MenuSub
}

export function polyline(
  latLngs: L.LatLngExpression[] | L.LatLngExpression[][],
  options?: MPathOptions,
) {
  return L.polyline(latLngs, options)
}

export function addLineLayer(data: any, menuSub: MenuSub) {
  const key = menuSub.layer || menuSub.markType
  const layerValue = polylineGroupMap.get(key!)
  if (layerValue) {
    layerValue.clearLayers()
    toRaw(unref(leafletMap)!).removeLayer(layerValue as L.FeatureGroup)
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
        menuSub,
      },
    )
  })
  const markerLayers = makers.map((maker) => {
    const { MarkType, icon, coalbed } = maker
    const markconfig = icon.split('.')[0]

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
  const featureGroup = L.featureGroup([...lineLayers, ...markerLayers])
    .addTo(toRaw(unref(leafletMap)!))
  polylineGroupMap.set(key!, featureGroup)
}

export function clearLayers() {
  polylineGroupMap.forEach((layer) => {
    layer.clearLayers()
    toRaw(unref(leafletMap)!).removeLayer(layer as L.FeatureGroup)
  })
  polylineGroupMap.clear()
}
