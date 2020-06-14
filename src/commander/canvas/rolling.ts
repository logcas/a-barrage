import BaseCanvasCommander from './base-canvas'
import { ScrollBarrageObject, CommanderConfig } from '../../types'
import { isEmptyArray, getArrayRight } from '../../helper'
import { TIME_PER_FRAME } from '../../constants'
import Track from '../../track'

export default class RollingCommander extends BaseCanvasCommander<ScrollBarrageObject> {
  constructor(canvas: HTMLCanvasElement, config: CommanderConfig) {
    super(canvas, config)
  }

  private get _defaultSpeed(): number {
    return (this.trackWidth / this.duration) * TIME_PER_FRAME
  }

  private get _randomSpeed(): number {
    return 0.8 + Math.random() * 1.3
  }

  add(barrage: ScrollBarrageObject): boolean {
    const trackId = this._findTrack()
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
      const { speed: preSpeed } = getArrayRight<ScrollBarrageObject>(track.barrages)
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

  _findTrack(): number {
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

  _extractBarrage(): void {
    let isIntered: boolean
    for (let i = 0; i < this.waitingQueue.length; ) {
      isIntered = this.add(this.waitingQueue[i])
      if (!isIntered) {
        break
      }
      this.waitingQueue.shift()
    }
  }

  render(): void {
    this._extractBarrage()
    const ctx = this.ctx
    const trackHeight = this.trackHeight
    this.forEach((track: Track<ScrollBarrageObject>, trackIndex) => {
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
