import * as L from 'leaflet'
import type { LatLngExpression, MarkerOptions } from 'leaflet'

interface MOptions extends MarkerOptions {
  key: string
  data?: object
}

export function marker(latlng: LatLngExpression, options?: MOptions) {
  return L.marker(latlng, options)
}
