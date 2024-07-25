import * as L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { watch } from 'vue'

// import { useRoute } from 'vue-router'
// import { publishInit } from '../mqtt/publish'
import { showSatellite, tileLayersGroup } from './tileLayer'
import { zoom as onZoom } from './event'
import { cadLayersGroup } from './cadsLayer'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'
import { useUserSetting } from '@/hooks/web/sys/useUser'

const mapStore = useMapStore()

export function createMap(id: string) {
  // const route = useRoute()
  const { mineInfo } = useUserSetting()
  watch(() => mineInfo.value, async (mineInfo) => {
    const { show_map, show_cad, centerB, centerL, max_zoom, no_show_satellitemap } = mineInfo
    const center: LatLngExpression = [centerB, centerL]
    const maxZoom = max_zoom || 25
    const minZoom = no_show_satellitemap ? show_cad : show_map

    const map = L.map(id, {
      center,
      zoom: show_map,
      minZoom,
      maxZoom,
      attributionControl: false,
      zoomControl: false,
    })
    mapStore.setMap(map)

    map.on('zoom', onZoom)

    const hash = behaviorHash({ map, mineInfo })
    hash()
    map.on('moveend', hash.updateHashIfNeeded)

    tileLayersGroup.addTo(map)

    cadLayersGroup.addTo(map)

    /* 根据路由的部门ID查询菜单及图纸 */
    // const departmentID = route.query?.departmentID
    //   || route.params?.departmentID
    // publishInit(departmentID)

    if (no_show_satellitemap)
      return
    showSatellite()
  })
}
