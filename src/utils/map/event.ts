import type { LeafletEvent } from 'leaflet'
import { unref } from 'vue'
import { removeTileLayer, showSatellite } from './tileLayer'
import { clearCadLayers, defaultCad } from './cadsLayer'
import { clearMarkerLayers } from './marker'
import { lineNameHide } from './polyline'
import { clearLayers, openPopup } from '.'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { leafletMap } from '@/utils/map'
import { useMenuHide } from '@/components/Menu'
import { useHideMinePoint } from '@/components/Application'

let refreshCad = true
export function zoom(e: LeafletEvent) {
  const { setMenuHide } = useMenuHide()
  const { seHideMinePoint } = useHideMinePoint()
  const { mineInfo } = useUserSetting()
  const { show_cad, show_map } = mineInfo.value
  const map = e?.target
  const zoom = map.getZoom()

  if (zoom <= show_map) {
    refreshCad = true
    setMenuHide(false)
    clearCadLayers()
    clearMarkerLayers()
    clearLayers()
    seHideMinePoint(false)
    showSatellite()
  }

  if (zoom >= show_cad) {
    setMenuHide(true)
    if (refreshCad) {
      removeTileLayer()
      defaultCad()
      refreshCad = false
      seHideMinePoint(true)
    }
  }
  lineNameHide(zoom)
}

export function toShowCad() {
  const { mineInfo } = useUserSetting()
  const { centerB, centerL, show_cad } = mineInfo.value
  unref(leafletMap)!.setView([centerB, centerL], show_cad)
}

export function onClickLayer(layer: L.LeafletEvent) {
  const { sourceTarget } = layer
  openPopup(sourceTarget.options.data)
}
