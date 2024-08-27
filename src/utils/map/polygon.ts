import * as L from 'leaflet'
import './pathDashFlow'
import type { FeatureGroup, LatLngExpression, Polygon, PolylineOptions } from 'leaflet'
import { reactive } from 'vue'
import type { MenuSub } from '@/components/Menu/src/types/menu'

interface POptions extends PolylineOptions {
  key?: string
  data?: object
  dashSpeed?: number
  menuSub?: MenuSub
}

export const polygonFeatureGroup = L.featureGroup()
export const polygonGroupMap = reactive(new Map<string, FeatureGroup>())

export function polygon(latlngs: LatLngExpression[], options: POptions): Polygon {
  return L.polygon(latlngs, options)
}

export function addPolygonLayer(data: any, menuSub: MenuSub) {
  console.log(data, menuSub)
}

/**
 * 选择风险等级选择对应的颜色
 *
 * @param workingFaceState
 * @return {string}
 */
export function workingFaceStateColor(state: string): string {
  switch (state) {
    case '待采':
      return '#52c41a'
    case '正在采':
      return '#ffa940'
    case '已采':
      return '#ff4d4f'
    default:
      return ''
  }
}

/**
 *
 * @param {*} areaType
 * @returns
 */
export function areaTypeColor(areaType: string): string {
  if (areaType.includes('限制')) {
    return '#ffa940'
  }
  if (areaType.includes('重点')) {
    return '#ff4d4f'
  }
  if (areaType.includes('普通')) {
    return '#2f54eb'
  }
  if (areaType.includes('井上')) {
    return '#52c41a'
  }
  return ''
}
