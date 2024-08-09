import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import type { LatLngExpression, MarkerOptions } from 'leaflet'
import { unref } from 'vue'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { basePoint } from '@/enums/mapEnum'

interface MOptions extends MarkerOptions {
  key: string | basePoint
  data?: object
}

export const markerFeatureGroup = L.featureGroup()

export const markerclusterMap = new Map<string, L.MarkerClusterGroup>()

export function marker(latlng: LatLngExpression, options?: MOptions) {
  return L.marker(latlng, options)
}

export function clearMarkerLayers() {
  markerFeatureGroup.clearLayers()
}

export function removeMineBasePoint() {
  const layers = markerFeatureGroup.getLayers()

  for (const [_key, value] of Object.entries(basePoint)) {
    const point = layers.find((_layer) => {
      return _layer.options.key === value
    })
    if (point)
      markerFeatureGroup.removeLayer(point)
  }
}

export function createMineBasePoint() {
  const { mineInfo } = useUserSetting()
  const { b, l, x, y, centerB, centerL, centerX, centerY, z } = unref(mineInfo)
  createBaseMarker(
    [b, l],
    '实际基点',
    {
      纬度: b,
      经度: l,
      X: x,
      Y: y,
      Z: z,
    },
    basePoint.BASE_POINT,
  )
  createBaseMarker(
    [centerB, centerL],
    '计算基点',
    {
      纬度: centerB,
      经度: centerL,
      X: centerX,
      Y: centerY,
      Z: z,
    },
    basePoint.CENTER_POINT,
  )
}

function createBaseMarker(
  latLng: LatLngExpression,
  tooltip: string,
  popupContent: {
    [key: string]: any
  },
  key: basePoint,
) {
  let markerpopupContent: string = `<h3>${tooltip}</h3><hr>`

  Object.keys(popupContent)
    .forEach((e) => {
      markerpopupContent
        += `<p><span>${e}: </span><b>${popupContent[e]}</b></p>`
    })
  const point = marker(latLng, { key })
    .bindTooltip(tooltip, { permanent: true, direction: 'right', className: key })
    .bindPopup(markerpopupContent)
  markerFeatureGroup.addLayer(point)
}
