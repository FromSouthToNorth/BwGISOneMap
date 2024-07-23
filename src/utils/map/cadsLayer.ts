import * as L from 'leaflet'
import type { Layer, TileLayer } from 'leaflet'

import { ref, toRaw, unref } from 'vue'
import { useCadSetting } from '@/hooks/setting/useCadSetting'
import { useCadStoreWithOut } from '@/store/modules/cad'
import { mapURLEnum } from '@/enums/mapEnum'

const cadStore = useCadStoreWithOut()

export const cadLayersGroup = L.featureGroup()

export const refSelectCadsMap = ref(new Map<string, string[]>())
export const refSelectCoalSeamSet = ref(new Set<string>())

export function hasCadsMap(key: string) {
  return unref(refSelectCadsMap).has(key)
}

function setCadsMap(key: string, value: string[]) {
  unref(refSelectCadsMap).set(key, value)
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
  const index = cadLayersGroup.getLayers().findIndex(({ options }) => { return options.dwgId === key })
  return index !== -1
}

export function removeCadLayer(key: string) {
  const cadLayer = cadLayersGroup.getLayers().filter(({ options }) => { return options.dwgId === key })
  cadLayer.forEach((cadLayer) => {
    cadLayersGroup.removeLayer(cadLayer)
  })
  deleteCadsMap(key)
}

export function coalSeamBySetCadLayer(coalSeam: string) {
  addSelectCoalSeamSet(coalSeam)
  unref(refSelectCadsMap).forEach((_, key) => {
    setCadLayer(key)
  })
}

export function coalSeamByRemoveCadLayer(coalSeam: string) {
  const cadLayer = cadLayersGroup.getLayers().filter(({ options }) => { return options.coalSeam === coalSeam })
  cadLayer.forEach((layer) => {
    cadLayersGroup.removeLayer(layer)
  })
  deleteSelectCoalSeamSet(coalSeam)
  if (!unref(refSelectCoalSeamSet).size)
    unref(refSelectCadsMap).clear()
}

export function defaultCad() {
  const cads = toRaw(useCadSetting().cads.value)
  const cadName = cads[0].cads[0].typeName
  cadStore.setCadName(cadName)
  setCadLayer(cads[0].cads[0].dwgId)
}

export function setCadLayer(dwgId: string) {
  const css: string[] = []
  unref(refSelectCoalSeamSet).forEach((value) => {
    css.push(value)
    const cadLayer = cadLayerWms(dwgId, value)
    cadLayersGroup.addLayer(cadLayer)
  })
  setCadsMap(dwgId, css)
}

function cadLayerWms(dwgId: string, coalSeam: string, cadUrl = mapURLEnum.CAD_URL): TileLayer.WMS {
  return L.tileLayer.wms(cadUrl, {
    layers: `bwcad:${dwgId}${coalSeam}`,
    // crs: L.CRS.EPSG4326,
    format: 'image/png',
    transparent: true,
    minZoom: 8,
    maxZoom: 25,
    coalSeam,
    dwgId,
  })
}

export function removeCadLayers() {
  cadLayersGroup.clearLayers()
}
