import * as L from 'leaflet'
import { centroid, lineString, polygon, toGeoJSONLatLngs } from '../turf'
import { marker } from './marker'
import { polyline } from './polyline'
import { isLatLng, isLatLngs } from '.'
import { BasePoint, LayerType } from '@/enums/mapEnum'

export const activeFeatureGroup = L.featureGroup()

export function addActiveLayer(data: any | L.LatLngExpression[], clazz?: string) {
  clearFeatureGroup()
  let activeLayer: L.Layer | undefined
  let cent: number[] = []
  if (isLatLng(data)) {
    const { B, L } = data
    cent = [B, L]
    activeLayer = activeMarker(cent, clazz)
  }
  else if (isLatLngs(data)) {
    const { MarkType } = data
    const coordinates = toGeoJSONLatLngs(MarkType.coordinates)
    switch (MarkType.type[0]) {
      case LayerType.POLYGON:
        cent = centroid(polygon(coordinates))
        activeLayer = activeLine([...MarkType.coordinates, MarkType.coordinates[0]])
        break
      case LayerType.LINE:
      case LayerType.POLYLINE:
        cent = centroid(lineString(coordinates))
        activeLayer = activeLine(MarkType.coordinates)
        break
      case LayerType.MARKER:
        const { lat, lng } = MarkType.coordinates[0]
        activeLayer = activeMarker([lat, lng])
        break
    }
  }
  if (activeLayer) {
    activeFeatureGroup.addLayer(activeLayer)
  }
  activeFeatureGroup.bringToBack()
}

function activeMarker(
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

export function clearFeatureGroup() {
  activeFeatureGroup.clearLayers()
}
