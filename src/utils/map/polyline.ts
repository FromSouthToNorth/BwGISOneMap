import * as L from 'leaflet'
import { cloneDeep } from 'lodash-es'
import { reactive, toRaw, unref } from 'vue'
import { onClickLayer } from './event'
import { marker, svgIcon } from './marker'
import { isLatLngs, leafletMap } from '.'
import type { MenuSub } from '@/components/Menu/src/types/menu'
import './Leaflet.TextPath'

export interface PathOptions extends L.PathOptions {
  key?: string
  coalbed?: string
  data?: any
  menuSub?: MenuSub
  tunnelName?: string
  reverse?: boolean
}

interface LineLayer extends L.Layer {
  setText: ((name: string, options: any) => any) & ((opt: null) => any)
}

export const polylineFeatureGroup = L.featureGroup()

export const polylineGroupMap = reactive(new Map<string, L.FeatureGroup>())

export function polyline(
  latLngs: L.LatLngExpression[] | L.LatLngExpression[][],
  options?: PathOptions,
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
  data.forEach((layer: any) => {
    const { MarkType } = layer
    if (isLatLngs(layer)) {
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
    const coordinates = cloneDeep(MarkType.coordinates)
    const _reverse = reverse(coordinates)
    const latLngs = _reverse ? coordinates.reverse() : coordinates
    return polyline(
      latLngs,
      {
        data: line,
        key: line[menuSub.tableKey!],
        coalbed,
        weight,
        color,
        menuSub,
        tunnelName: TunnelName,
        reverse: _reverse,
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
    .addTo(toRaw(unref(leafletMap)!)).on('click', onClickLayer)
  polylineGroupMap.set(key!, featureGroup)
}

export function clearLayers() {
  polylineGroupMap.forEach((layer) => {
    layer.clearLayers()
    toRaw(unref(leafletMap)!).removeLayer(layer as L.FeatureGroup)
  })
  polylineGroupMap.clear()
}

let _lineNameHide = false
const LineNameHideLevel = 19
export function lineNameHide(zoom: number) {
  if (zoom >= LineNameHideLevel
    && _lineNameHide) {
    polylineGroupMap.forEach((group, _key) => {
      const layers = group.getLayers()
      layers.forEach((layer) => {
        const { tunnelName } = layer.options as PathOptions
        if (tunnelName) {
          (layer as LineLayer)
            .setText(
              tunnelName,
              {
                center: true,
                clazz: 'label',
              },
            )
        }
      })
    })
    _lineNameHide = false
  }
  else if (zoom < LineNameHideLevel
    && !_lineNameHide) {
    polylineGroupMap.forEach((group, _key) => {
      const layers = group.getLayers()
      layers.forEach((layer) => {
        const { tunnelName } = layer.options as PathOptions
        if (tunnelName) {
          (layer as LineLayer).setText(null)
        }
      })
    })
    _lineNameHide = true
  }
}

function reverse(p: L.LatLng[]): boolean {
  const angle = Math.atan2(
    p[1].lat - p[0].lat,
    p[1].lng - p[0].lng,
  )
  return !(
    p[0].lng < p[p.length - 1].lng
    && angle < Math.PI / 2
    && angle > -Math.PI / 2
  )
}

export function selectLien(id: string, key?: string): L.Polyline | undefined {
  let resLayer: L.Polyline | undefined
  if (key && polylineGroupMap.has(key)) {
    resLayer = polylineGroupMap.get(key)?.getLayers().find((layer) => {
      return (layer.options as PathOptions).key === id
    }) as L.Polyline
  }
  else {
    for (const [_key, layers] of polylineGroupMap) {
      resLayer = layers.getLayers().find((layer) => {
        return (layer.options as PathOptions).key === id
      }) as L.Polyline
      if (resLayer)
        break
    }
  }
  return resLayer
}
