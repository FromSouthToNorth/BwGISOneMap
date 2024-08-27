import type { Polygon, TileLayer, TileLayerOptions } from 'leaflet'
import { toRaw, unref } from 'vue'
import * as L from 'leaflet'
import { isArray } from '../is'
import { marker } from './marker'
import { toShowCad } from './event'
import { toLatlngs } from './to'
import { polygon } from './polygon'
import { MineLayersEnum } from '@/enums/mapEnum'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { useSatelliteSetting } from '@/components/Application'

let mineBoundary: Polygon

let tileSatellite: TileLayer

export const tileLayersGroup = L.featureGroup()

interface MTileLayer {
  tileUrl: string
  options?: MOptions
}
interface MOptions extends TileLayerOptions {
  key?: string
}

const tileUrl = import.meta.env.VITE_GLOB_MAP_URL

export const tileLayer: MTileLayer = {
  tileUrl,
  options: {
    accessToken: '',
    key: MineLayersEnum.MINE_SATELLITE,
    zIndex: -100,
  },
}

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
  const mm = marker([centerB, centerL], { key: MineLayersEnum.MINE_MARKER })
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
  if (no_show_satellitemap || (!is_show_mineboundary && !isArray(latLngs)))
    return

  const lls = toLatlngs(latLngs)
  const color = '#2196F3'
  mineBoundary = polygon(lls, {
    color,
    dashSpeed: 1,
    key: MineLayersEnum.MINE_BOUNDARY,
  })
  mineBoundary.on('mouseover', () => {
    mineBoundary.setStyle({
      color: '#76FF03',
      dashArray: '12, 12',
      dashSpeed: 30,
    } as L.PathOptions)
  })
  mineBoundary.on('mouseout', () => {
    mineBoundary.setStyle({
      color,
      dashArray: '',
      dashSpeed: 0,
    } as L.PathOptions)
  })
  mineBoundary.on('click', () => {
    toShowCad()
  })
  tileLayersGroup.addLayer(mineBoundary)
}

export function tile() {
  const { mineInfo } = useUserSetting()
  const { satelliteImageToken } = unref(mineInfo)
  tileLayer.options!.accessToken = satelliteImageToken
  const { tileUrl, options } = tileLayer
  tileSatellite = L.tileLayer(tileUrl, options)
    .on('tileerror', (e) => {
      console.error(e)
    })
}

export function addSatelliteTile() {
  tileLayersGroup.addLayer(tileSatellite)
}

export function removeSatelliteTile() {
  tileLayersGroup.removeLayer(tileSatellite)
}

export function removeTileLayer() {
  const { getIsSatellite } = useSatelliteSetting()
  const layers = tileLayersGroup.getLayers()
  for (const layer of layers) {
    if (unref(getIsSatellite)
      && (layer.options as MOptions).key === MineLayersEnum.MINE_SATELLITE) {
      continue
    }
    tileLayersGroup.removeLayer(layer)
  }
}
