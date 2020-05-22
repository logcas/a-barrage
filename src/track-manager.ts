import Track from './track'
import { BarrageObject } from './types'
import { isEmptyArray, getArrayRight, TIME_PER_FRAME } from './helper'

interface TrackManagerForEachHandler {
  (track: Track, index: number, array: Track[]): void
}

export default class TrackManager {
  trackWidth: number
  trackHeight: number
  tracks: Track[] = []
  duration: number

  constructor(width: number, height: number, trackSum: number, duration: number) {
    this.trackHeight = height
    this.trackWidth = width
    this.duration = duration

    for (let i = 0; i < trackSum; ++i) {
      this.tracks[i] = new Track()
    }
  }

  forEach(handler: TrackManagerForEachHandler) {
    for (let i = 0; i < this.tracks.length; ++i) {
      handler(this.tracks[i], i, this.tracks)
    }
  }

  add(barrage: BarrageObject) {
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
      offset: trackWidth + barrage.width * 1.2,
      speed
    })
    track.push(normalizedBarrage)

    return true
  }

  _findMatchestTrack() {
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

  get _defaultSpeed(): number {
    return (this.trackWidth / this.duration) * TIME_PER_FRAME
  }

  get _randomSpeed(): number {
    return 0.8 + Math.random() * 1.3
  }

  reset() {
    this.forEach(track => track.reset())
  }
}
