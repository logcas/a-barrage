import Track from './track'
import { BarrageObject } from './types'
import { TIME_PER_FRAME } from './helper'
import { findTrackStragy, addBarrageStragy, pushBarrageStragy, renderBarrageStragy } from './stragy'
import { isFunction } from 'util'

interface TrackManagerForEachHandler<T extends BarrageObject> {
  (track: Track<T>, index: number, array: Track<T>[]): void
}

type BarrageType = 'scroll' | 'fixed-top' | 'fixed-bottom'

interface TrackManagerConfig {
  trackWidth: number
  trackHeight: number
  duration: number
  numbersOfTrack: number
  type: BarrageType
}

export default class TrackManager<T extends BarrageObject> {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  trackWidth: number
  trackHeight: number
  tracks: Track<T>[] = []
  duration: number
  type: BarrageType
  waitingQueue: T[] = []

  constructor(canvas: HTMLCanvasElement, config: TrackManagerConfig) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')!
    const { trackWidth, trackHeight, duration, numbersOfTrack, type } = config
    this.trackHeight = trackHeight
    this.trackWidth = trackWidth
    this.duration = duration
    this.type = type

    for (let i = 0; i < numbersOfTrack; ++i) {
      this.tracks[i] = new Track()
    }
  }

  forEach(handler: TrackManagerForEachHandler<T>) {
    for (let i = 0; i < this.tracks.length; ++i) {
      handler(this.tracks[i], i, this.tracks)
    }
  }

  add(barrage: T) {
    const fn = addBarrageStragy[this.type]
    return isFunction(fn) && fn.call(this, barrage)
  }

  _findMatchestTrack(): number {
    const fn = findTrackStragy[this.type]
    return isFunction(fn) ? fn.call(this) : -1
  }

  _pushBarrage() {
    const fn = pushBarrageStragy[this.type]
    return isFunction(fn) ? fn.call(this) : false
  }

  render(): void {
    const fn = renderBarrageStragy[this.type]
    isFunction(fn) && fn.call(this)
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

  resize(trackWidth?: number, trackHeight?: number) {
    if (trackWidth) {
      this.trackWidth = trackWidth
    }
    if (trackHeight) {
      this.trackHeight = trackHeight
    }
  }
}
