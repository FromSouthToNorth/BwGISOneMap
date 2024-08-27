import {
  lineString as turfLineString,
  point as turfPoint,
  polygon as turfPolygon,
} from '@turf/helpers'
import { centroid as turfCentroid } from '@turf/centroid'

export function polygon(latLngs: any) {
  return turfPolygon(latLngs)
}

export function lineString(latLngs: any) {
  return turfLineString(latLngs)
}

export function centroid(geo: any) {
  console.log(turfCentroid(geo))
}

export function toGeoJSONLatLng(latLng: L.LatLng) {
  return [latLng.lng, latLng.lng]
}

export function toGeoJSONLatLngs(_latLngs: L.LatLng[]) {
  const latLngs: number[][] = []
  _latLngs.forEach((l) => {
    latLngs.push([l.lng, l.lat])
  })
  return latLngs
}

export function point(latLng: L.LatLng) {
  return turfPoint([latLng.lat, latLng.lng])
}
