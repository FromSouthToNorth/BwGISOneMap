import * as L from 'leaflet'
import type { Map } from 'leaflet'

L.Path.mergeOptions({
  // @option dashSpeed: Number
  // The speed of the dash array, in pixels per second
  dashSpeed: 0,
})

const _originalBeforeAdd = L.Path.prototype.beforeAdd

L.Path.include({

  beforeAdd(map: Map) {
    _originalBeforeAdd!.bind(this)(map)

    if (this.options.dashSpeed) {
      this._lastDashFrame = performance.now()
      this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this))
    }
  },

  _onDashFrame() {
    if (!this._renderer)
      return

    const now = performance.now()
    const dashOffsetDelta = (now - this._lastDashFrame) * this.options.dashSpeed / 1000

    this.options.dashOffset = Number(this.options.dashOffset || 0) + dashOffsetDelta
    this._renderer._updateStyle(this)

    this._lastDashFrame = performance.now()

    this._dashFrame = L.Util.requestAnimFrame(this._onDashFrame.bind(this))
  },

})
