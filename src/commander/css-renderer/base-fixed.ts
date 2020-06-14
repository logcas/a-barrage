import BaseCssCommander from './base-css'
import { CommanderConfig, FixedBarrageObejct } from '../../types'
import Track from '../../track'
import { isEmptyArray } from '../../helper'
import { createBarrage, appendChild } from '../../helper/css'

export default abstract class BaseFixedCssCommander extends BaseCssCommander<FixedBarrageObejct> {
  protected elHeight: number

  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(el, config)

    this.elHeight = el.offsetHeight
  }

  add(barrage: FixedBarrageObejct): boolean {
    const trackId = this._findTrack()
    if (trackId === -1) {
      return false
    }
    // 创建弹幕DOM
    const { text, size, color, offset } = barrage
    const fontSize = size + 'px'
    let posLeft = offset + 'px'
    const danmu = createBarrage(text, color, fontSize, posLeft)
    appendChild(this.el, danmu)
    const width = danmu.offsetWidth

    // 计算位置
    const track = this.tracks[trackId]
    const trackWidth = this.trackWidth
    const barrageOffset = (trackWidth - width) / 2
    const normalizedBarrage = Object.assign({}, barrage, {
      offset: barrageOffset,
      duration: this.duration,
      width
    })

    this.objToElm.set(normalizedBarrage, danmu)
    this.elmToObj.set(danmu, normalizedBarrage)
    track.push(normalizedBarrage)
    return true
  }

  _findTrack(): number {
    let idx = -1
    for (let i = 0; i < this.tracks.length; ++i) {
      if (isEmptyArray(this.tracks[i].barrages)) {
        idx = i
        break
      }
    }
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

  _removeTopElementFromTrack(track: Track<FixedBarrageObejct>) {
    const barrage = track.barrages[0]
    if (!barrage) {
      return
    }
    const el = this.objToElm.get(barrage)!
    this.objToElm.delete(barrage)
    this.elmToObj.delete(el)
    this.removeElement(el)
  }
}
