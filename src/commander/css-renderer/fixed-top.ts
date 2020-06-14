import BaseFixedCommander from './base-fixed'
import { TIME_PER_FRAME } from '../../constants'
import { CommanderConfig } from '../../types'

export default class FixedTopCommander extends BaseFixedCommander {
  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(el, config)
  }

  render(): void {
    this._extractBarrage()
    const objToElm = this.objToElm
    const trackHeight = this.trackHeight
    this.tracks.forEach((track, trackIndex) => {
      const barrage = track.barrages[0]
      if (!barrage) {
        return
      }
      const el = objToElm.get(barrage)
      if (!el) {
        return
      }
      if (barrage.freeze) {
        return
      }
      const { offset } = barrage
      const y = trackIndex * trackHeight
      el.style.transform = `translate(${offset}px, ${y}px)`
      barrage.duration -= TIME_PER_FRAME
      if (barrage.duration <= 0) {
        this._removeTopElementFromTrack(track)
        track.removeTop()
      }
    })
  }
}
