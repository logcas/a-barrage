import TrackManager from '../track-manager'
import { FixedBarrageObejct } from '../types'
import { isEmptyArray, TIME_PER_FRAME } from '../helper'

export default {
  add(this: TrackManager<FixedBarrageObejct>, barrage: FixedBarrageObejct) {
    const trackId = this._findMatchestTrack()
    if (trackId === -1) {
      return false
    }

    const track = this.tracks[trackId]
    const trackWidth = this.trackWidth
    const { width } = barrage
    const barrageOffset = (trackWidth - width) / 2
    const normalizedBarrage = Object.assign({}, barrage, {
      offset: barrageOffset,
      duration: this.duration
    })
    track.push(normalizedBarrage)
    return true
  },
  find(this: TrackManager<FixedBarrageObejct>) {
    let idx = -1
    for (let i = 0; i < this.tracks.length; ++i) {
      if (isEmptyArray(this.tracks[i].barrages)) {
        idx = i
        break
      }
    }
    return idx
  },
  renderTop(this: TrackManager<FixedBarrageObejct>) {
    this._pushBarrage()
    const ctx = this.context
    const trackHeight = this.trackHeight
    this.tracks.forEach((track, index) => {
      const barrage = track.barrages[0]
      if (!barrage) {
        return
      }
      const { color, text, offset, size } = barrage
      ctx.fillStyle = color
      ctx.font = `${size}px 'Microsoft Yahei'`
      ctx.fillText(text, offset, (index + 1) * trackHeight)
      barrage.duration -= TIME_PER_FRAME
      if (barrage.duration <= 0) {
        track.removeTop()
      }
    })
  },
  renderBottom(this: TrackManager<FixedBarrageObejct>) {
    this._pushBarrage()
    const ctx = this.context
    const trackHeight = this.trackHeight
    const canvasHeight = this.canvas.height
    const startY = canvasHeight - this.trackHeight * this.tracks.length
    this.tracks.forEach((track, index) => {
      const barrage = track.barrages[0]
      if (!barrage) {
        return
      }
      const { color, text, offset, size } = barrage
      ctx.fillStyle = color
      ctx.font = `${size}px 'Microsoft Yahei'`
      ctx.fillText(text, offset, startY + index * trackHeight)
      barrage.duration -= TIME_PER_FRAME
      if (barrage.duration <= 0) {
        track.removeTop()
      }
    })
  }
}
