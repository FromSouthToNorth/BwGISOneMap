import * as L from 'leaflet'
import { reactive, toRaw, unref } from 'vue'
import { marker, svgIcon } from './marker'
import { leafletMap } from '.'
import type { MenuSub } from '@/components/Menu/src/types/menu'
import './Leaflet.TextPath'

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
    const { MarkType, coalbed, weight, color, TunnelName } = line
    const options = {
      center: true,
      clazz: 'label',
    }
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
    ).setText(TunnelName, options)
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

function reverse(p: L.LatLngExpression[]): boolean {
  const angle = Math.atan2(p[1].lat - p[0].lat, p[1].lng - p[0].lng)
  return !(p[0].lng < p[p.length - 1].lng && angle < Math.PI / 2 && angle > -Math.PI / 2)
}
