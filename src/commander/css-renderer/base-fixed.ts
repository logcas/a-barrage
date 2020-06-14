import BaseCssCommander from './base-css'
import { CommanderConfig, FixedBarrageObejct } from '../../types'
import Track from '../../track'
import { isEmptyArray } from '../../helper'

export default abstract class BaseFixedCssCommander extends BaseCssCommander<FixedBarrageObejct> {
  // FixedBarrageObejct ---> HTML 的映射
  objToElm: WeakMap<FixedBarrageObejct, HTMLElement> = new WeakMap()

  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(el, config)
  }

  add(barrage: FixedBarrageObejct): boolean {
    const trackId = this._findTrack()
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
    this.removeElement(el)
  }
}
