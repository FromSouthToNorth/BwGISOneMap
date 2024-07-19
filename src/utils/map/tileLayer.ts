import type { Polygon, TileLayer, TileLayerOptions } from 'leaflet'
import { toRaw } from 'vue'
import * as L from 'leaflet'
import { isArray } from '../is'
import { marker } from './marker'
import { toShowCad } from './event'
import { toLatlngs } from './to'
import { polygon } from './polygon'
import { EncryptionFactory } from '@/utils/cipher'
import { mineLayersEnum } from '@/enums/mapEnum'
import { useUserSetting } from '@/hooks/web/sys/useUser'

let mineBoundary: Polygon

let tileSatellite: TileLayer[]

export const tileLayersGroup = L.featureGroup()

interface MTileLayer {
  tileUrl: string
  options?: MOptions
}
interface MOptions extends TileLayerOptions {
  key?: string
}
const base64 = EncryptionFactory.createBase64Encryption()

const accessToken
  = base64.decrypt('cGsuZXlKMUlqb2lZM1Z6WHpneWNXMDFkMk16SWl3aVlTSTZJamQ1YW1sa04yeGhNbVp3TVRKMmIyRTBjWEJzZUdaMFlXa2lMQ0owSWpvMGZRLm1FOHZpcVlhYVBqSFpKVEp2eGRFWmoyelo1QjFFN3pIeDdDeTRVMk5lcjQ=')

const tileUrl = import.meta.env.VITE_GLOB_MAP_URL

export const tileLayers: Array<MTileLayer> = [
  {
    tileUrl,
    options: {
      accessToken,
      key: mineLayersEnum.MINE_SATELLITE,
      zIndex: -100,
    },
  },
]

export function showSatellite() {
  mineMarker()
  tile()
  addSatelliteTile()
  if (mineBoundary && !tileLayersGroup.hasLayer(mineBoundary))
    tileLayersGroup.addLayer(mineBoundary)
}

export function mineMarker() {
  const { mineInfo } = useUserSetting()
  const { centerB, centerL, mineName } = toRaw(mineInfo.value)
  // TODO: keepInView 为 true 控制台显示 Uncaught RangeError: Maximum call stack size exceeded
  const mm = marker([centerB, centerL], { key: mineLayersEnum.MINE_MARKER })
  tileLayersGroup.addLayer(mm)
  mm.on('click', (e) => {
    L.DomEvent.stopPropagation(e)
    toShowCad()
  })
  mm.bindPopup(mineName, { autoClose: false, closeOnClick: false })
    .openPopup()
}

export function setMineBoundary(latLngs: BL[]) {
  const { mineInfo } = useUserSetting()
  const { is_show_mineboundary, no_show_satellitemap } = toRaw(mineInfo.value)
  if (no_show_satellitemap || !is_show_mineboundary && !isArray(latLngs))
    return

  const lls = toLatlngs(latLngs)
  mineBoundary = polygon(lls, {
    color: '#2196F3',
    dashSpeed: 1,
    key: mineLayersEnum.MINE_BOUNDARY,
  })
  mineBoundary.on('mouseover', () => {
    mineBoundary.setStyle({
      color: '#76FF03',
      dashArray: '12, 12',
      dashSpeed: 30,
    })
  })
  mineBoundary.on('mouseout', () => {
    mineBoundary.setStyle({
      color: '#2196F3',
      dashArray: '',
      dashSpeed: 0,
    })
  })
  mineBoundary.on('click', () => {
    toShowCad()
  })
  tileLayersGroup.addLayer(mineBoundary)
}

export function tile() {
  tileSatellite = []
  tileLayers.forEach(({ tileUrl, options }) => {
    const tileLayer = L.tileLayer(tileUrl, options)
      .on('tileerror', (e) => {
        console.error(e)
      })
    tileSatellite.push(tileLayer)
  })
}

export function addSatelliteTile() {
  tileSatellite.forEach((e) => {
    tileLayersGroup.addLayer(e)
  })
}

export function removeSatelliteTile() {
  tileSatellite.forEach((e) => {
    tileLayersGroup.removeLayer(e)
  })
}

export function removeTileLayer() {
  tileLayersGroup.clearLayers()
}
