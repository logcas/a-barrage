import { BARRAGE_TYPE } from '../constants'
import { BarrageObject } from '../types'
import { isEmptyArray, getArrayRight } from '.'
import TrackManager from '../track-manager'

export const addBarrageStragy = {
  [BARRAGE_TYPE.SCROLL](this: TrackManager, barrage: BarrageObject) {
    const trackId = this._findMatchestTrack()
    if (trackId === -1) {
      return false
    }

    const track = this.tracks[trackId]
    const trackOffset = track.offset
    const trackWidth = this.trackWidth
    let speed: number
    if (isEmptyArray(track.barrages)) {
      speed = this._defaultSpeed * this._randomSpeed
    } else {
      const { speed: preSpeed } = getArrayRight(track.barrages)
      speed = (trackWidth * preSpeed) / trackOffset
    }
    speed = Math.min(speed, this._defaultSpeed * 2)

    const normalizedBarrage = Object.assign({}, barrage, {
      offset: trackWidth,
      speed
    })
    track.push(normalizedBarrage)
    track.offset = trackWidth + barrage.width * 1.2
    return true
  }
}

export const findTrackStragy = {
  [BARRAGE_TYPE.SCROLL](this: TrackManager) {
    let idx = -1
    let max = -Infinity
    this.forEach((track, index) => {
      const trackOffset = track.offset
      if (trackOffset > this.trackWidth) {
        return
      }
      const t = this.trackWidth - trackOffset
      if (t > max) {
        idx = index
        max = t
      }
    })
    return idx
  }
}

export const pushBarrageStragy = {
  [BARRAGE_TYPE.SCROLL](this: TrackManager) {
    let isIntered: boolean
    for (let i = 0; i < this.waitingQueue.length; ) {
      isIntered = this.add(this.waitingQueue[i])
      if (!isIntered) {
        break
      }
      this.waitingQueue.shift()
    }
  }
}

export const renderBarrageStragy = {
  [BARRAGE_TYPE.SCROLL](this: TrackManager) {
    this._pushBarrage()
    const ctx = this.context
    const trackHeight = this.trackHeight
    this.forEach((track, trackIndex) => {
      let removeTop = false
      track.forEach((barrage, barrageIndex) => {
        const { color, text, offset, speed, width, size } = barrage
        ctx.fillStyle = color
        ctx.font = `${size}px 'Microsoft Yahei'`
        ctx.fillText(text, offset, (trackIndex + 1) * trackHeight)
        barrage.offset -= speed
        if (barrageIndex === 0 && barrage.offset < 0 && Math.abs(barrage.offset) >= width) {
          removeTop = true
        }
      })
      track.updateOffset()
      if (removeTop) {
        track.removeTop()
      }
    })
  }
}
