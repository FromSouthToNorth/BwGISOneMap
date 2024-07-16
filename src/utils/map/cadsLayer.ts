import * as L from 'leaflet'
import type { TileLayer } from 'leaflet'

import { toRaw } from 'vue'
import { useMapSetting } from '@/hooks/web/map/useMap'
import { type Cad, useMapStoreWithOut } from '@/store/modules/map'
import { mapURLEnum } from '@/enums/mapEnum'

const mapStore = useMapStoreWithOut()

export const cadLayersGroup = L.featureGroup()

export function defaultCad() {
  const { cads } = useMapSetting()
  setCadLayer(toRaw(cads.value)[0].cads[0])
}

export function setCadLayer(cad: Cad) {
  const coalSeam = toRaw(useMapSetting().coalSeam.value)
  const { coalSeams, dwgId } = cad
  const _coalSeam = coalSeams.map((e) => { return e.CoalBed })
  const filCoalSeam = coalSeam.filter((e) => { return _coalSeam.includes(e.Value) })
  mapStore.setCoalSeam(filCoalSeam)
  filCoalSeam.forEach(({ Value }) => {
    const cadLayer = cadLayerWms(`${dwgId}${Value}`)
    cadLayersGroup.addLayer(cadLayer)
  })
}

function cadLayerWms(dwgId: string, cadUrl = mapURLEnum.CAD_URL): TileLayer.WMS {
  return L.tileLayer.wms(cadUrl, {
    layers: `bwcad:${dwgId}`,
    // crs: L.CRS.EPSG4326,
    format: 'image/png',
    transparent: true,
    minZoom: 8,
    maxZoom: 25,
  })
}

export function removeCadLayers() {
  cadLayersGroup.clearLayers()
}
