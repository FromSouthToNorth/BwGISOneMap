import type { LeafletEvent } from 'leaflet'
import { toRaw } from 'vue'
import { removeTileLayer, showSatellite } from './tileLayer'
import { defaultCad, removeCadLayers } from './cadsLayer'
import { useUserSetting } from '@/hooks/web/sys/useUser'
import { useMapSetting } from '@/hooks/web/map/useMap'

let refreshCad = true
export function zoom(e: LeafletEvent) {
  const { mineInfo } = useUserSetting()
  const { show_cad, show_map } = mineInfo.value
  const map = e?.target
  const zoom = map.getZoom()
  if (zoom <= show_map) {
    refreshCad = true
    removeCadLayers()
    showSatellite()
  }

  if (zoom >= show_cad) {
    removeTileLayer()
    if (refreshCad) {
      defaultCad()
      refreshCad = false
    }
  }
}

export function toShowCad() {
  const { map } = useMapSetting()
  const { mineInfo } = useUserSetting()
  const { centerB, centerL, show_cad } = mineInfo.value
  toRaw(map.value).setView([centerB, centerL], show_cad)
}
