import type { LeafletEvent } from 'leaflet'
import { toRaw } from 'vue'
import { removeTileLayer, showSatellite } from './tileLayer'
import { clearCadLayers, defaultCad } from './cadsLayer'
import { clearMarkerLayers } from './marker'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { useMapSetting } from '@/hooks/web/map/useMap'
import { useMenuHide } from '@/components/Menu'
import { useHideMinePoint, useSatelliteSetting } from '@/components/Application'

let refreshCad = true
export function zoom(e: LeafletEvent) {
  const { setIsSatellite } = useSatelliteSetting()
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
    seHideMinePoint(false)
    showSatellite()
    setIsSatellite(refreshCad)
  }

  if (zoom >= show_cad) {
    setMenuHide(true)
    if (refreshCad) {
      removeTileLayer()
      defaultCad()
      refreshCad = false
      setIsSatellite(refreshCad)
      seHideMinePoint(true)
    }
  }
}

export function toShowCad() {
  const { map } = useMapSetting()
  const { mineInfo } = useUserSetting()
  const { centerB, centerL, show_cad } = mineInfo.value
  toRaw(map.value).setView([centerB, centerL], show_cad)
}
