import type { Polygon, TileLayerOptions } from 'leaflet'
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
import { useMapSetting } from '@/hooks/web/map/useMap'

let mineBoundary: Polygon

export const tileLayersGroup = L.featureGroup()

interface TileLayer {
  tileUrl: string
  options?: TileLayerOptions
}
const base64 = EncryptionFactory.createBase64Encryption()

const accessToken
  = base64.decrypt('cGsuZXlKMUlqb2lZM1Z6WHpneWNXMDFkMk16SWl3aVlTSTZJamQ1YW1sa04yeGhNbVp3TVRKMmIyRTBjWEJzZUdaMFlXa2lMQ0owSWpvMGZRLm1FOHZpcVlhYVBqSFpKVEp2eGRFWmoyelo1QjFFN3pIeDdDeTRVMk5lcjQ=')

const tileUrl = import.meta.env.VITE_GLOB_MAP_URL

export const tileLayers: Array<TileLayer> = [
  {
    tileUrl,
    options: {
      accessToken,
      key: mineLayersEnum.MINE_SATELLITE,
    },
  },
]

export function showSatellite() {
  tile()
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
  const { is_show_mineboundary } = toRaw(mineInfo.value)
  if (!is_show_mineboundary && !isArray(latLngs))
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
  tileLayers.forEach(({ tileUrl, options }) => {
    const tileLayer = L.tileLayer(tileUrl, options)
      .on('tileerror', (e) => {
        console.error(e)
      })
    tileLayersGroup.addLayer(tileLayer)
  })
  mineMarker()
}

export function removeTileLayer() {
  tileLayersGroup.clearLayers()
}
