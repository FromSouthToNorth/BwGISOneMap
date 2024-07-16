import * as L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { publishInit } from '../mqtt/publish'
import { tile, tileLayersGroup } from './tileLayer'
import { zoom } from './event'
import { cadLayersGroup } from './cadsLayer'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'
import { useUserSetting } from '@/hooks/web/sys/useUser'

const mapStore = useMapStore()

export function createMap(id: string) {
  const route = useRoute()
  const { mineInfo } = useUserSetting()

  /* 根据路由的部门ID查询菜单及图纸 */
  const departmentID = route.query?.departmentID || route.params?.departmentID
  watch(() => mineInfo.value, (mineInfo) => {
    const { show_map, centerB, centerL, max_zoom } = mineInfo
    const center: LatLngExpression = [centerB, centerL]

    const map = L.map(id, {
      zoom: show_map,
      center,
      maxZoom: max_zoom || 25,
      minZoom: show_map,
      attributionControl: false,
      zoomControl: false,
    })
    mapStore.setMap(map)

    const hash = behaviorHash({ map, mineInfo })
    hash()
    map.on('moveend', hash.updateHashIfNeeded)

    map.on('zoom', zoom)
    publishInit(departmentID)

    tileLayersGroup.addTo(map)

    cadLayersGroup.addTo(map)

    tile()
  })
}
