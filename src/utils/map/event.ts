import type { LeafletEvent } from 'leaflet'
import { toRaw } from 'vue'
import { removeTileLayer, showSatellite } from './tileLayer'
import { defaultCad, removeCadLayers } from './cadsLayer'
import { useUserSetting } from '@/hooks/web/sys/useUser'
import { useMapSetting } from '@/hooks/web/map/useMap'
import { useMenuHide } from '@/components/Menu/src/hooks/useMenuHide'
import { useSatelliteSetting } from '@/components/Application/src/satellite/hooks/useSatelliteSetting'

let refreshCad = true
export function zoom(e: LeafletEvent) {
  const { mineInfo } = useUserSetting()
  const { show_cad, show_map } = mineInfo.value
  const map = e?.target
  const zoom = map.getZoom()

  if (zoom <= show_map) {
    refreshCad = true
    useMenuHide().setMenuHide(false)
    removeCadLayers()
    showSatellite()
    useSatelliteSetting().setIsSatellite(refreshCad)
  }

  if (zoom >= show_cad) {
    useMenuHide().setMenuHide(true)
    if (refreshCad) {
      removeTileLayer()
      defaultCad()
      refreshCad = false
      useSatelliteSetting().setIsSatellite(refreshCad)
    }
  }
}

export function toShowCad() {
  const { map } = useMapSetting()
  const { mineInfo } = useUserSetting()
  const { centerB, centerL, show_cad } = mineInfo.value
  toRaw(map.value).setView([centerB, centerL], show_cad)
}
