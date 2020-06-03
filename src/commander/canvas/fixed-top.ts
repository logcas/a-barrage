import BaseFixedCommander from './base-fixed'
import { TIME_PER_FRAME } from '../../constants'

export default class FixedTopCommander extends BaseFixedCommander {
  render(): void {
    this._extractBarrage()
    const ctx = this.ctx
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
  }
}
