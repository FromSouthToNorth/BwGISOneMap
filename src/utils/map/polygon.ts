import * as L from 'leaflet'
import './pathDashFlow'
import type { LatLngExpression, Polygon, PolylineOptions } from 'leaflet'

interface POptions extends PolylineOptions {
  key?: string
  data?: object
  dashSpeed?: number
}

export const polygonFeatureGroup = L.featureGroup()

export function polygon(latlngs: LatLngExpression[], options: POptions): Polygon {
  return L.polygon(latlngs, options)
}
