import * as L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import * as turf from '@turf/turf'

export function toLatlng(bl: BL): LatLngExpression {
  return L.latLng(bl.B, bl.L)
}
export function toArrLatlng(bl: BL): LatLngExpression {
  return [bl.B, bl.L]
}

export function toLatlngs(bls: BL[], arrIs?: boolean): LatLngExpression[] {
  const latLng = bls.map((bl) => {
    return arrIs ? toArrLatlng(bl) : toLatlng(bl)
  })
  return latLng
}

export function truncate(latLng: LatLngExpression, coordinates = 3, precision = 7): LatLngExpression {
  const p = point(latLng)
  const { geometry } = turf.truncate(p, { precision, coordinates })
  return L.latLng(geometry.coordinates[1], geometry.coordinates[0])
}

export function point(latLng: LatLngExpression) {
  return turf.point([latLng.lat, latLng.lng])
}
