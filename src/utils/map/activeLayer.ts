import * as L from 'leaflet'
import { marker } from './marker'
import { polyline } from './polyline'
import { isLatLng, isLatLngs } from '.'
import { BasePoint, LayerType } from '@/enums/mapEnum'

export const activeFeatureGroup = L.featureGroup()

export function addActiveLayer(data: any | L.LatLngExpression[], clazz?: string) {
  clearActiveLayers()
  let activeLayer: L.Layer | undefined
  if (isLatLng(data)) {
    const { B, L } = data
    activeLayer = activeMarker([B, L], clazz)
  }
  else if (isLatLngs(data)) {
    const { MarkType } = data
    const { lat, lng } = (MarkType.coordinates[0] as unknown) as L.LatLng
    switch (MarkType.type[0]) {
      case LayerType.POLYGON:
        activeLayer = activeLine([...MarkType.coordinates, MarkType.coordinates[0]])
        break
      case LayerType.LINE:
      case LayerType.POLYLINE:
        activeLayer = activeLine(MarkType.coordinates)
        break
      case LayerType.MARKER:
        activeLayer = activeMarker([lat, lng])
        break
    }
  }
  if (activeLayer) {
    activeFeatureGroup.addLayer(activeLayer)
  }
  activeFeatureGroup.bringToBack()
}

function activeMarker(latlng: number[], clazz?: string) {
  const className = `active-marker flicker ${clazz || ''}`
  const icon = L.divIcon({
    iconSize: [30, 30],
    className,
  })
  return marker(
    (latlng as L.LatLngExpression),
    {
      icon,
      key: BasePoint.HIG_MARKER,
    },
  )
    .setZIndexOffset(-1000)
}

function higMarker(
  latlng: number[],
  clazz?: string,
) {
  const className = clazz || ''
  const icon = L.divIcon({
    iconSize: [160, 160],
    className: 'hig-marker',
    html: `<span class="water1 ${className}"></span>
           <span class="water2 ${className}"></span>
           <span class="water3 ${className}"></span>
           <span class="water4 ${className}"></span>`,
  })
  return marker((latlng as L.LatLngExpression), { icon, key: BasePoint.HIG_MARKER }).setZIndexOffset(-1000)
}

function activeLine(
  latlng: L.LatLngExpression[],
  clazz?: string,
) {
  const className = `flicker ${clazz || ''} `
  const weight = 16
  return polyline(latlng, { color: '#ff4d4f', className, weight })
}

export function clearActiveLayers() {
  activeFeatureGroup.clearLayers()
}
