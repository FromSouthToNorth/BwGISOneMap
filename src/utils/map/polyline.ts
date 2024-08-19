import * as L from 'leaflet'
import type { FeatureGroup } from 'leaflet'
import type { MenuSub } from '@/components/Menu/src/types/menu'

export const polylineFeatureGroup = L.featureGroup()

export const polylineGroupMap = new Map<string, FeatureGroup>()

export function addLineLayer(data: any, menuSub: MenuSub) {
  console.log(data, menuSub)
}
