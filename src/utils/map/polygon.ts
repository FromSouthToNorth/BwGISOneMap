import * as L from 'leaflet'
import './pathDashFlow'
import type { FeatureGroup, LatLngExpression, Polygon, PolylineOptions } from 'leaflet'
import type { MenuSub } from '@/components/Menu/src/types/menu'

interface POptions extends PolylineOptions {
  key?: string
  data?: object
  dashSpeed?: number
}

export const polygonFeatureGroup = L.featureGroup()
export const polygonGroupMap = new Map<string, FeatureGroup>()

export function polygon(latlngs: LatLngExpression[], options: POptions): Polygon {
  return L.polygon(latlngs, options)
}

export function addPolygonLayer(data: any, menuSub: MenuSub) {
  console.log(data, menuSub)
}
