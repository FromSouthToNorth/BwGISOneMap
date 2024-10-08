import * as L from 'leaflet'
import type {
  Layer,
  LayerOptions,
  TileLayer,
  TileLayerOptions,
} from 'leaflet'

import { ref, toRaw, unref } from 'vue'
import type { Cad } from '../mqtt/types'
import { isArray } from '../is'
import { useCadSetting } from '@/components/Application/src/cad'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { MapURLEnum, PublicTile } from '@/enums/mapEnum'

const { getDefaultCad, getCoalSeam } = useCadSetting()

interface MTileLayerOptions extends TileLayerOptions {
  dwgId?: string
  key?: string
}

interface MFeatureGroupOptions extends LayerOptions {
  coalSeam?: string
}

export const cadLayersGroup = L.featureGroup()

export const refSelectCadsMap = ref(new Map<string, Cad>())
export const refSelectCoalSeamSet = ref(new Set<string>())
export const refSelectDwgLayerSet = ref(new Set<string>())

export function hasDwgLayerSet(key: string) {
  return unref(refSelectDwgLayerSet).has(key)
}

export function addSelectDwgLayerSet(dwgLayer: string, cad?: Cad) {
  unref(refSelectDwgLayerSet).add(dwgLayer)
  if (cad)
    setDwgCadLayer(cad)
}

function setDwgCadLayer(cad: Cad) {
  const { dwgId, isPublicLayers } = cad
  const CQL_FILTER = getCqlFilter()
  const cadLayers = cadLayersGroup.getLayers()
  const layers = cadLayers.filter(({ options }) => {
    return (options as any).dwgId === dwgId
  })
  if (isArray(layers) && layers.length) {
    layers.forEach((layer) => {
      const cadLayer = layer as TileLayer.WMS
      cadLayer.setUrl(MapURLEnum.CAD_URLS)
      cadLayer.setParams({ CQL_FILTER })
    })
  }
  else {
    const { mineInfo } = useUserSetting()
    const { mineDesc } = toRaw(mineInfo.value)
    unref(refSelectCoalSeamSet).forEach((value) => {
      if (isPublicLayers) {
        const cadLayer = cadLayerWms(`${mineDesc}${PublicTile.PUBLIC}`, value, MapURLEnum.CAD_URLS)
        cadLayersGroup.addLayer(cadLayer)
      }
      const cadLayer = cadLayerWms(dwgId, value, MapURLEnum.CAD_URLS)
      cadLayer.setParams({ CQL_FILTER })
      cadLayersGroup.addLayer(cadLayer)
    })
  }
}

function getCqlFilter(): string {
  const dwgLayerSet = unref(refSelectDwgLayerSet)
  return PublicTile.CQL_FILTER_START.concat(`'${Array.from(dwgLayerSet).join('\',\'')}'`, PublicTile.CQL_FILTER_END)
}

export function deleteSelectDwgLayerSet(dwgLayer: string, cad: Cad) {
  unref(refSelectDwgLayerSet).delete(dwgLayer)
  const cadLayers = cadLayersGroup.getLayers()

  const layers = cadLayers.filter(({ options }) => {
    return (options as MTileLayerOptions).dwgId === cad.dwgId
  })
  const CQL_FILTER = getCqlFilter()

  layers.forEach((layer) => {
    const cadLayer = layer as TileLayer.WMS
    cadLayer.setUrl(MapURLEnum.CAD_URLS)
    cadLayer.setParams({ CQL_FILTER })
  })
}

export function hasCadsMap(key: string) {
  return unref(refSelectCadsMap).has(key)
}

function setCadsMap(key: string, cad: Cad) {
  unref(refSelectCadsMap).set(key, cad)
}

function deleteCadsMap(key: string) {
  unref(refSelectCadsMap).delete(key)
}

export function hasCoalSeamSet(key: string) {
  return unref(refSelectCoalSeamSet).has(key)
}

export function addSelectCoalSeamSet(key: string) {
  unref(refSelectCoalSeamSet).add(key)
}

function deleteSelectCoalSeamSet(key: string) {
  unref(refSelectCoalSeamSet).delete(key)
}

export function getCadLayers(): Layer[] {
  return cadLayersGroup.getLayers()
}

export function hasLayer(key: string) {
  const index = cadLayersGroup.getLayers().findIndex(({ options }) => {
    return (options as MTileLayerOptions).dwgId === key
  })
  return index !== -1
}

export function removeCadLayer(cad: Cad) {
  const { dwgId, Layers } = cad
  if (isArray(Layers) && Layers.length) {
    Layers.forEach(({ DwgLayer }) => {
      if (hasDwgLayerSet(DwgLayer))
        deleteSelectDwgLayerSet(DwgLayer, cad)
    })
  }
  const cadLayer = cadLayersGroup.getLayers().filter(({ options }) => {
    return (options as MTileLayerOptions).dwgId === dwgId
  })
  cadLayer.forEach((cadLayer) => {
    cadLayersGroup.removeLayer(cadLayer)
  })
  deleteCadsMap(dwgId)
}

export function coalSeamBySetCadLayer(coalSeam: string) {
  addSelectCoalSeamSet(coalSeam)
  const map = unref(refSelectCadsMap)
  if (!map.size) {
    const cad = toRaw(unref(getDefaultCad)) as unknown as Cad
    setCadsMap(cad.dwgId, cad)
  }
  map.forEach((value) => {
    setCadLayer(value)
  })
}

export function coalSeamByRemoveCadLayer(coalSeam: string) {
  const cadLayer = cadLayersGroup.getLayers().filter(({ options }) => {
    return (options as MFeatureGroupOptions).coalSeam === coalSeam
  })
  cadLayer.forEach((layer) => {
    cadLayersGroup.removeLayer(layer)
  })
  deleteSelectCoalSeamSet(coalSeam)
  if (!unref(refSelectCoalSeamSet).size)
    unref(refSelectCadsMap).clear()
}

export function defaultCad() {
  const cad = toRaw(unref(getDefaultCad)) as unknown as Cad
  setCadLayer(cad)
}

export function setCadLayer(cad: Cad) {
  const { dwgId, Layers } = cad
  if (isArray(Layers)) {
    Layers.forEach((e) => {
      addSelectDwgLayerSet(e.DwgLayer)
    })
  }
  const coalSeam = unref(getCoalSeam)
  const set = unref(refSelectCoalSeamSet)
  if (!set.size) {
    coalSeam.forEach(({ Value }) => {
      addSelectCoalSeamSet(Value)
    })
  }
  set.forEach((value) => {
    const cadLayer = cadLayerWms(dwgId, value, MapURLEnum.CAD_URL)
    cadLayersGroup.addLayer(cadLayer)
  })
  setCadsMap(dwgId, cad)
}

function cadLayerWms(dwgId: string, coalSeam: string, cadUrl: MapURLEnum): TileLayer.WMS {
  return L.tileLayer.wms(cadUrl, {
    // crs: L.CRS.EPSG4326,
    layers: `bwcad:${dwgId}${coalSeam}`,
    format: 'image/png',
    transparent: true,
    minZoom: 8,
    maxZoom: 25,
    coalSeam,
    dwgId,
  }).on('tileerror', (e) => {
    console.error(`${dwgId} ${coalSeam} tile  图片加载错误:  ${e}`)
  })
}

export function clearCadLayers() {
  cadLayersGroup.clearLayers()
}
