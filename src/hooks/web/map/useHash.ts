import _throttle from 'lodash-es/throttle'

import type { Map } from 'leaflet'
import { MAP_LOCATION } from '@/enums/cacheEnum'
import { utilQsString, utilStringQs } from '@/utils'
import { utilObjectOmit } from '@/utils/object'
import { getCache, setCache } from '@/utils/cache'

export function behaviorHash(context?: any) {
  const map: Map = context.map

  let _cachedHash: any = null
  const _latitudeLimit = 90 - 1e-8

  function computedHashParameters(): object {
    const center: any = map.getCenter()
    const zoom: number = map.getZoom()
    const precision: number = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2))
    const oldParams: any = utilObjectOmit(utilStringQs(window.location.hash), [
      'comment',
      'source',
      'hashtags',
      'walkthrough',
    ])
    const newParams: any = {}

    delete oldParams.id
    newParams.map = `${zoom.toFixed(2)}/${center.lat.toFixed(precision)}/${center.lng.toFixed(
      precision,
    )}`

    return Object.assign(oldParams, newParams)
  }

  function computedHash(): string {
    return `#${utilQsString(computedHashParameters(), true)}`
  }

  function updateHashIfNeeded() {
    const latestHash: string = computedHash()
    if (_cachedHash !== latestHash) {
      _cachedHash = latestHash
      window.history.replaceState(null, '', latestHash)
      const q = utilStringQs(latestHash)
      if (q.map)
        setCache(MAP_LOCATION, JSON.stringify({ value: q.map }))
    }
  }

  const _throttledUpdate = _throttle(updateHashIfNeeded, 500)

  function hashchange() {
    // ignore spurious hashchange events
    if (window.location.hash === _cachedHash)
      return
    _cachedHash = window.location.hash
    const q = utilStringQs(_cachedHash)
    const mapArgs = (q.map || '').split('/').map(Number)
    if (mapArgs.length < 3 || mapArgs.some(Number.isNaN)) {
      updateHashIfNeeded()
    }
    else {
      // don't update if the new hash already reflects the state of iD
      if (_cachedHash === computedHash())
        return
      map.setView(
        [Math.min(_latitudeLimit, Math.max(-_latitudeLimit, mapArgs[1])), mapArgs[2]],
        mapArgs[0],
      )
    }
  }

  function behavior() {
    map.on('moveend', _throttledUpdate)
    window.addEventListener('hashchange', hashchange)

    const mapLocation = getCache(MAP_LOCATION) as string

    if (mapLocation) {
      const mapArgs = mapLocation.split('/').map(Number)
      map.setView(
        [Math.min(_latitudeLimit, Math.max(-_latitudeLimit, mapArgs[1])), mapArgs[2]],
        mapArgs[0],
      )

      updateHashIfNeeded()
    }

    hashchange()
  }

  behavior.updateHashIfNeeded = updateHashIfNeeded

  behavior.off = function () {
    _throttledUpdate.cancel()
    map.off('moveend', _throttledUpdate)
    window.location.hash = ''
  }

  return behavior
}
