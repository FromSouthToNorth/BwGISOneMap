import * as L from 'leaflet'
import './pathDashFlow'
import type {
  FeatureGroup,
  LatLngExpression,
  Polygon,
  PolylineOptions,
} from 'leaflet'
import { reactive, toRaw, unref } from 'vue'
import { getColor } from '../color'
import { isLatLngs, leafletMap } from '.'
import type { MenuSub } from '@/components/Menu/src/types/menu'
import { LayerType } from '@/enums/mapEnum'

interface MPathOptions extends PolylineOptions {
  key?: string
  data?: object
  coalbed?: string
  dashSpeed?: number
  menuSub?: MenuSub
}

export const polygonFeatureGroup = L.featureGroup()
export const polygonGroupMap = reactive(new Map<string, FeatureGroup>())

export function polygon(latlngs: LatLngExpression[], options: MPathOptions): Polygon {
  return L.polygon(latlngs, options)
}

export function addPolygonLayer(data: any, menuSub: MenuSub) {
  const key = menuSub.layer || menuSub.markType
  const layerValue = polygonGroupMap.get(key!)
  if (layerValue) {
    layerValue.clearLayers()
    toRaw(unref(leafletMap)!).removeLayer(layerValue as L.FeatureGroup)
    polygonGroupMap.delete(key!)
  }
  const layers = data.filter((e: any) =>
    isLatLngs(e) && e.MarkType.type[0] === LayerType.POLYGON)
    .map((p: any) => {
      const { MarkType, coalbed, color: c, FaceState } = p
      const color = FaceState ? getColor(FaceState) : (c || '#76FF03')
      return polygon(
        MarkType.coordinates,
        {
          data: p,
          key: p[menuSub.tableKey!],
          coalbed,
          color,
          menuSub,
        },
      )
    })
  const featureGroup = L.featureGroup(layers)
    .addTo(toRaw(unref(leafletMap)!))
  polygonGroupMap.set(key!, featureGroup)
}

export function clearLayers() {
  polygonGroupMap.forEach((layer) => {
    layer.clearLayers()
    toRaw(unref(leafletMap)!).removeLayer(layer as L.FeatureGroup)
  })
  polygonGroupMap.clear()
}
