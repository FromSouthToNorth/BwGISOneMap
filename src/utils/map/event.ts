import type { LeafletEvent } from 'leaflet'
import { tileLayersGroup } from '.'
import { mineInfo } from '@/hooks/web/sys/useUser'

export function zoom(e: LeafletEvent) {
  const { max_zoom, show_cad, show_map, hide_cad, hide_map } = mineInfo.value

  const zoom = e?.target.getZoom()

  if (zoom <= show_map) {
    console.warn('显示卫星图')
    tileLayersGroup.forEach((layer) => {
      if (!e?.target.hasLayer(layer))
        layer.addTo(e?.target)
    })
  }

  if (zoom >= show_cad) {
    console.warn('显示图纸: ')
    tileLayersGroup.forEach((layer) => {
      e?.target.removeLayer(layer)
    })
  }
}
