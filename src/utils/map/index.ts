import * as L from 'leaflet'
import type { Map } from 'leaflet'
import { tileLayers } from './tileLayer'
import { buildUUID } from '@/utils/uuid'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { useMapStore } from '@/store/modules/map'

const mapStore = useMapStore()

export function createMap(id: string): Map {
  const map = L.map(id, {
    zoom: 8,
    center: [47.23234, 130.24275],
  })
  tileLayers.forEach(({ tileUrl, options }) => {
    L.tileLayer(tileUrl, options).addTo(map)
  })
  const hash = behaviorHash({ map })
  hash()

  mapStore.setMap(map)
  console.log('uuid: ', buildUUID())
  return map
}
