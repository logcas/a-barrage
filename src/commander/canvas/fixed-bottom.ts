import BaseFixedCommander from './base-fixed'
import { TIME_PER_FRAME } from '../../constants'
import { CommanderConfig } from '../../types'

export default class FixedBottomCommander extends BaseFixedCommander {
  constructor(canvas: HTMLCanvasElement, config: CommanderConfig) {
    super(canvas, config)
  }

  render(): void {
    this._extractBarrage()
    const ctx = this.ctx
    const trackHeight = this.trackHeight
    const canvasHeight = this.canvas.height
    const startY = canvasHeight - this.trackHeight * this.tracks.length
    this.tracks.forEach((track, index) => {
      const barrage = track.barrages[0]
      if (!barrage) {
        return
      }
      const { color, text, offset, size } = barrage
      ctx.fillStyle = color
      ctx.font = `${size}px 'Microsoft Yahei'`
      ctx.fillText(text, offset, startY + index * trackHeight)
      barrage.duration -= TIME_PER_FRAME
      if (barrage.duration <= 0) {
        track.removeTop()
      }
    })
  }
}
