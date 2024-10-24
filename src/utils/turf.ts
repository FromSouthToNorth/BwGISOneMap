import {
  lineString as turfLineString,
  point as turfPoint,
  polygon as turfPolygon,
} from '@turf/helpers'
import {
  center,
} from '@turf/center'
import { centroid as turfCentroid } from '@turf/centroid'

// 判断两点是否相等
export function pointEqual(point1: number[], point2: number[]) {
  return point1[0] === point2[0] && point1[1] === point2[1]
}

export function polygon(_latLngs: any) {
  const latLngs = [..._latLngs]
  if (!pointEqual(latLngs[0], latLngs[1])) {
    latLngs.push(latLngs[0])
  }
  return turfPolygon([latLngs])
}

export function lineString(latLngs: any) {
  return turfLineString(latLngs)
}

export function turfCenter(geo: any) {
  return center(geo).geometry.coordinates.reverse()
}

export function centroid(geo: any) {
  return turfCentroid(geo).geometry.coordinates.reverse()
}

export function toGeoJSONLatLng(latLng: L.LatLng) {
  return [latLng.lng, latLng.lat]
}

export function toGeoJSONLatLngs(_latLngs: L.LatLng[]) {
  const latLngs: number[][] = []
  _latLngs.forEach((l) => {
    latLngs.push(toGeoJSONLatLng(l))
  })
  return latLngs
}

export function point(latLng: L.LatLng) {
  return turfPoint([latLng.lat, latLng.lng])
}
