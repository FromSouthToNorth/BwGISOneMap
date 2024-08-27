import * as L from 'leaflet'
import type { LatLngExpression } from 'leaflet'

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
