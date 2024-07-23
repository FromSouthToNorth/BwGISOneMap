import * as L from 'leaflet'
import type { Layer, TileLayer } from 'leaflet'

import { ref, toRaw, unref } from 'vue'
import type { Cad } from '../mqtt/types'
import { useCadSetting } from '@/hooks/setting/useCadSetting'
import { useCadStoreWithOut } from '@/store/modules/cad'
import { mapURLEnum } from '@/enums/mapEnum'

const cadStore = useCadStoreWithOut()

export const cadLayersGroup = L.featureGroup()

export const refSelectCadsMap = ref(new Map<string, Cad>())
export const refSelectCoalSeamSet = ref(new Set<string>())

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
  const index = cadLayersGroup.getLayers().findIndex(({ options }) => { return options.dwgId === key })
  return index !== -1
}

export function removeCadLayer(cad: Cad) {
  const { dwgId } = cad
  const cadLayer = cadLayersGroup.getLayers().filter(({ options }) => { return options.dwgId === dwgId })
  cadLayer.forEach((cadLayer) => {
    cadLayersGroup.removeLayer(cadLayer)
  })
  deleteCadsMap(dwgId)
}

export function coalSeamBySetCadLayer(coalSeam: string) {
  addSelectCoalSeamSet(coalSeam)
  const map = unref(refSelectCadsMap)
  if (!map.size) {
    const cad = toRaw(useCadSetting().defaultCad.value)
    setCadsMap(cad.dwgId, cad)
  }
  map.forEach((value) => {
    setCadLayer(value)
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
  const cad = toRaw(useCadSetting().defaultCad.value)
  const cadName = cad.typeName
  cadStore.setCadName(cadName)
  setCadLayer(cad)
}

export function setCadLayer(cad: Cad) {
  const { dwgId } = cad
  const coalSeam = toRaw(useCadSetting().coalSeam.value)
  const set = unref(refSelectCoalSeamSet)
  if (!set.size) {
    coalSeam.forEach(({ Value }) => {
      addSelectCoalSeamSet(Value)
    })
  }
  set.forEach((value) => {
    const cadLayer = cadLayerWms(dwgId, value)
    cadLayersGroup.addLayer(cadLayer)
  })
  setCadsMap(dwgId, cad)
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
  }).on('tileerror', (e) => {
    console.error('tile 图片加载错误: ', e)
  })
}

export function removeCadLayers() {
  cadLayersGroup.clearLayers()
}
