import BaseCssCommander from './base-css'
import { ScrollBarrageObject, CommanderConfig } from '../../types'
import { isEmptyArray, getArrayRight } from '../../helper'
import { TIME_PER_FRAME } from '../../constants'
import Track from '../../track'
import { createBarrage, appendChild, setUnhoverStyle, setHoverStyle } from '../../helper/css'

export default class RollingCssCommander extends BaseCssCommander<ScrollBarrageObject> {
  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(el, config)
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
    // 创建弹幕DOM
    const { text, size, color, offset } = barrage
    const fontSize = size + 'px'
    const posLeft = offset + 'px'
    const danmu = createBarrage(text, color, fontSize, posLeft)
    appendChild(this.el, danmu)
    const width = danmu.offsetWidth

    // 计算弹幕速度
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
      speed,
      width
    })
    this.objToElm.set(normalizedBarrage, danmu)
    this.elmToObj.set(danmu, normalizedBarrage)
    track.push(normalizedBarrage)
    track.offset = trackWidth + normalizedBarrage.width * 1.2
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
    const objToElm = this.objToElm
    const trackHeight = this.trackHeight
    this.forEach((track: Track<ScrollBarrageObject>, trackIndex: number) => {
      let shouldRemove = false
      let shouldRemoveIndex = -1
      track.forEach((barrage, barrageIndex) => {
        if (!objToElm.has(barrage)) {
          return
        }
        if (barrage.freeze) {
          return
        }
        const el = objToElm.get(barrage)!
        const offset = barrage.offset
        el.style.transform = `translate(${offset}px, ${trackIndex * trackHeight}px)`
        barrage.offset -= barrage.speed
        if (barrage.offset < 0 && Math.abs(barrage.offset) > barrage.width) {
          shouldRemove = true
          shouldRemoveIndex = barrageIndex
        }
      })
      track.updateOffset()
      if (shouldRemove) {
        this._removeElementFromTrack(track, shouldRemoveIndex)
        track.remove(shouldRemoveIndex)
      }
    })
  }

  _removeElementFromTrack(track: Track<ScrollBarrageObject>, removedIndex: number) {
    const barrage = track.barrages[removedIndex]
    if (!barrage) {
      return
    }
    const el = this.objToElm.get(barrage)!
    this.objToElm.delete(barrage)
    this.elmToObj.delete(el)
    this.removeElement(el)
  }
}
