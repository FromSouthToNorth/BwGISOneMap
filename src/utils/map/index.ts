import * as L from 'leaflet'
import { buildUUID } from '@/utils/uuid'
import { behaviorHash } from '@/hooks/web/map/useHash'

export function createMap(id: string) {
  const map = L.map(id, {
    zoom: 8,
    center: [47.23234, 130.24275],
  })
  const hash = behaviorHash({ map })
  hash()
  console.log(buildUUID())
}
