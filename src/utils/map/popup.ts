import * as L from 'leaflet'
import { createApp, h, toRaw, unref } from 'vue'
import { isArray } from '../is'
import { addActiveLayer } from './activeLayer'
import { selectLien } from './polyline'
import { selectPolygon } from './polygon'
import { leafletMap } from '.'
import { LayerType } from '@/enums/mapEnum'
import { Tabs } from '@/components/Descriptions'

export const popupFeatureGroup = L.featureGroup()

function getCentroid(data: any) {
  const { MarkType, menuSub } = data
  const { tableKey } = menuSub

  let cent: any
  if (MarkType && isArray(MarkType.type)) {
    switch (MarkType.type[0]) {
      case LayerType.POLYGON:
        cent = selectPolygon(data[tableKey], menuSub.layer || menuSub.markType)!.getCenter()
        break
      case LayerType.LINE:
      case LayerType.POLYLINE:
        cent = selectLien(data[tableKey], menuSub.layer || menuSub.markType)!.getCenter()
        break
      case LayerType.MARKER:
        cent = [MarkType.coordinates[0].lat, MarkType.coordinates[0].lng]
        break
    }
  }
  else {
    cent = [data.B, data.L]
  }
  return cent
}

export function popup(data: any) {
  clearPopLayer()
  addActiveLayer(data)
  const dom = document.createDocumentFragment()
  const html = createApp({
    render() {
      return h(Tabs, { data, rightExtra: true })
    },
  }).mount(dom)

  const latlng = getCentroid(data)
  const pop = L.popup(latlng, { closeButton: false, minWidth: 860 })
    .setContent(html.$el)
  popupFeatureGroup.addLayer(pop)

  const map = toRaw(unref(leafletMap))
  const point = map!.latLngToLayerPoint(latlng)
  point.x -= 332
  point.y -= 200
  map!.flyTo(map!.layerPointToLatLng(point))
}

export function clearPopLayer() {
  popupFeatureGroup.clearLayers()
}
