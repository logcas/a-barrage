import BaseFixedCommander from './base-fixed'
import { TIME_PER_FRAME } from '../../constants'
import { CommanderConfig } from '../../types'
import { createBarrage } from '../../helper/css'

export default class FixedTopCommander extends BaseFixedCommander {
  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(el, config)
  }

  render(): void {
    this._extractBarrage()
    const objToElm = this.objToElm
    const trackHeight = this.trackHeight
    this.tracks.forEach((track, index) => {
      const barrage = track.barrages[0]
      if (!barrage) {
        return
      }
      let el = objToElm.get(barrage)
      if (!el) {
        const { text, color, size } = barrage
        el = createBarrage(text, color, size + 'px', '50%')
        const y = index * trackHeight + 'px'
        el.style.transform = `translate(-50%, ${y})`
        objToElm.set(barrage, el)
      } else {
        barrage.duration -= TIME_PER_FRAME
        if (barrage.duration <= 0) {
          this._removeTopElementFromTrack(track)
          track.removeTop()
        }
      }
    })
  }
}
