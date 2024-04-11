import * as L from 'leaflet'
import type { LatLng } from 'leaflet'
import * as turf from '@turf/turf'

export function tolatlng(bl: BL): LatLng {
  return L.latLng(bl.B, bl.L)
}

export function toLatlngs(bls: BL[]): LatLng[] {
  const latLng = bls.map((bl) => {
    return tolatlng(bl)
  })
  return latLng
}

export function truncate(latLng: LatLng, coordinates = 3, precision = 7): LatLng {
  const p = point(latLng)
  const { geometry } = turf.truncate(p, { precision, coordinates })
  return L.latLng(geometry.coordinates[1], geometry.coordinates[0])
}

export function point(latLng: LatLng) {
  return turf.point([latLng.lat, latLng.lng])
}
