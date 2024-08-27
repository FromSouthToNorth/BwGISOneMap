import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import type { LatLngExpression, Marker, MarkerCluster, MarkerOptions } from 'leaflet'
import { reactive, toRaw, unref } from 'vue'
import { isObject, isString } from '../is'
import { svgMarker } from './svgMarker'
import { isLatLng, leafletMap } from '.'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { BasePoint } from '@/enums/mapEnum'
import { useTool } from '@/components/Menu'
import type { MenuSub } from '@/components/Menu/src/types/menu'

interface MOptions extends MarkerOptions {
  key: string | BasePoint
  data?: any
  coalbed?: string
  menuSub?: MenuSub
}

const { getIsAggSwitch } = useTool()

export const markerFeatureGroup = L.featureGroup()

export const markerclusterMap = reactive(new Map<string, L.MarkerClusterGroup | L.FeatureGroup>())

export function marker(latlng: LatLngExpression, options?: MOptions) {
  return L.marker(latlng, options)
}

const clusterGroup = function (name: string, zoom?: number, count?: string) {
  return L.markerClusterGroup({
    disableClusteringAtZoom: zoom || 20,
    chunkedLoading: true,
    iconCreateFunction: (cluster: MarkerCluster) => {
      const childCount = markerCount(cluster, count)
      let c = ' marker-cluster-'
      if (childCount < 10) {
        c += 'small'
      }
      else if (childCount < 100) {
        c += 'medium'
      }
      else {
        c += 'large'
      }
      let html = `<div><span>${childCount}</span>`
      if (name) {
        html += `<p class="cg-labels">${name}</p>`
      }
      html += '</div>'
      return L.divIcon({
        html,
        className: `marker-cluster${c}`,
        iconSize: L.point(40, 40),
      })
    },
  })
}

function markerCount(cluster: MarkerCluster, count?: string) {
  let num = 0
  const c = cluster.getAllChildMarkers()
  for (let i = 0; i < c.length; i++) {
    if (!count) {
      return cluster.getChildCount()
    }
    else {
      num += Number(c[i].options.data[count])
    }
  }
  // 考虑到浮点型|负数
  return Number(num.toString()
    .match(/^-?\d+(?:\.\d{0,2})?/))
}

export function clearMarkerLayers() {
  markerFeatureGroup.clearLayers()
}

export function clearMarkerclusterMap() {
  console.log('clearMarkerclusterMap: ', markerclusterMap)

  markerclusterMap.forEach((value) => {
    toRaw(value).clearLayers()
    if (toRaw(unref(leafletMap)!).hasLayer(toRaw(value) as L.FeatureGroup)) {
      toRaw(unref(leafletMap)!).removeLayer(toRaw(value) as L.FeatureGroup)
    }
  })
  markerclusterMap.clear()
}

export function featureToCluster() {
  markerclusterMap.forEach((_layer, key) => {
    const layer = toRaw(_layer)
    if (layer instanceof L.FeatureGroup) {
      const markers = layer.getLayers()
      const { menuSub } = markers[0].options as MOptions
      const { markerclusterMaxZoom: zoom, moduleName, count } = menuSub as MenuSub
      layer.clearLayers()
      toRaw(unref(leafletMap)!).removeLayer(layer)
      const layers = clusterGroup(moduleName, zoom, count).addLayers(markers)
      layers.addTo(toRaw(unref(leafletMap)!))
      markerclusterMap.set(key, layers)
    }
  })
}

export function clusterToFeature() {
  markerclusterMap.forEach((_layer, key) => {
    const layer = toRaw(_layer)
    if (layer instanceof L.MarkerClusterGroup) {
      const markers = layer.getLayers()
      layer.clearLayers()
      toRaw(unref(leafletMap)!).removeLayer(layer)
      const layers = L.featureGroup(markers).addTo(toRaw(unref(leafletMap)!))
      markerclusterMap.set(key, layers)
    }
  })
}

export function removeMineBasePoint() {
  const layers = markerFeatureGroup.getLayers()

  for (const [_key, value] of Object.entries(BasePoint)) {
    const point = layers.find((_layer) => {
      return (_layer.options as MOptions).key === value
    })
    if (point)
      markerFeatureGroup.removeLayer(point)
  }
}

export function createMineBasePoint() {
  const { mineInfo } = useUserSetting()
  const { b, l, x, y, centerB, centerL, centerX, centerY, z } = unref(mineInfo)
  createBaseMarker(
    [b, l],
    '实际基点',
    {
      纬度: b,
      经度: l,
      X: x,
      Y: y,
      Z: z,
    },
    BasePoint.BASE_POINT,
  )
  createBaseMarker(
    [centerB, centerL],
    '计算基点',
    {
      纬度: centerB,
      经度: centerL,
      X: centerX,
      Y: centerY,
      Z: z,
    },
    BasePoint.CENTER_POINT,
  )
}

export function svgIcon(data: any) {
  const { markconfig } = data
  try {
    let svgSrc
    if (!markconfig) {
      svgSrc = svgMarker.markerDefault
    }
    else if (isString(markconfig)) {
      svgSrc = svgMarker[markconfig]
    }
    else if (isObject(markconfig)) {
      const { key, createMarkerIcon } = markconfig
      let icon
      const keys = Object.keys(createMarkerIcon)
      for (const _key of keys) {
        if (createMarkerIcon[_key] === data[key]) {
          icon = svgMarker[_key]
          break
        }
      }
      svgSrc = icon || svgMarker.markerDefault
    }
    return L.divIcon({
      className: 'point',
      iconSize: [22, 22],
      html: `<img src="${svgSrc}">`,
    })
  }
  catch (error) {
    console.error('图标配置错误! ', error, markconfig)
  }
}

function createMarkers(data: any) {
  const markers: Marker[] = data.map((value: any) => {
    const { L, B, MonitorValue, menuSub } = value
    const latLng: LatLngExpression = [B, L]
    let coalbed
    for (const key of Object.keys(value)) {
      if (key.toLowerCase() === 'coalbed') {
        coalbed = value[key]
        break
      }
    }
    const icon = svgIcon(value)
    const m = marker(latLng, {
      data: value,
      coalbed,
      icon,
      menuSub,
      key: value[menuSub.tableKey],
    })
    if (MonitorValue) {
      m.bindTooltip(
        `${MonitorValue}`,
        {
          permanent: true,
          direction: 'right',
        },
      )
    }
    return m
  })
  return markers
}

function createBaseMarker(
  latLng: LatLngExpression,
  tooltip: string,
  popupContent: {
    [key: string]: any
  },
  key: BasePoint,
) {
  let markerpopupContent: string = `<h3>${tooltip}</h3><hr>`

  Object.keys(popupContent)
    .forEach((e) => {
      markerpopupContent
        += `<p><span>${e}: </span><b>${popupContent[e]}</b></p>`
    })
  const point = marker(latLng, { key })
    .bindTooltip(tooltip, { permanent: true, direction: 'right', className: key })
    .bindPopup(markerpopupContent)
  markerFeatureGroup.addLayer(point)
}

export function addMarkerLayer(
  data: any,
  menuSub: MenuSub,
  markconfig: any,
) {
  const key = menuSub.layer || menuSub.markType
  const { markerclusterMaxZoom: zoom, moduleName, count } = menuSub

  const layerValue = markerclusterMap.get(key!)
  if (layerValue) {
    toRaw(layerValue).clearLayers()
  }

  const newData = data.map((e: any) => {
    return { ...e, menuSub, markconfig }
  }).filter(isLatLng)
  const markers = createMarkers(newData)

  let layerGroup
  layerGroup = unref(getIsAggSwitch)
    ? clusterGroup(moduleName, zoom, count).addLayers(markers)
    : layerGroup = L.featureGroup(markers)
  layerGroup.addTo(toRaw(unref(leafletMap)!))
  markerclusterMap.set(key!, layerGroup)
}

export function higMarker(
  latlng: L.LatLngExpression,
  _iconSize?: L.PointExpression,
  _clazz?: string,
  zIndexOffset?: number,
) {
  const className = _clazz || ''
  const iconSize = _iconSize || [160, 160]
  const icon = L.divIcon({
    iconSize,
    className: 'hig-marker',
    html: `<span class="water1 ${className}"></span>
           <span class="water2 ${className}"></span>
           <span class="water3 ${className}"></span>
           <span class="water4 ${className}"></span>`,
  })
  return marker(latlng, { zIndexOffset, icon, key: BasePoint.HIG_MARKER })
}

export function addHigMarker(
  latLng: L.LatLngExpression,
  _iconSize?: L.PointExpression,
  _clazz?: string,
  _zIndexOffset?: number,
) {
  clearHigMarker()
  const higMark = higMarker(latLng, _iconSize, _clazz, _zIndexOffset)
  markerFeatureGroup.addLayer(higMark)
}

function clearHigMarker() {
  const layers = markerFeatureGroup.getLayers()
  for (const layer of layers) {
    if ((layer.options as MOptions).key === BasePoint.HIG_MARKER) {
      markerFeatureGroup.removeLayer(layer)
    }
  }
}
