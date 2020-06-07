import BarrageMaker from '../a-barrage'
import {
  RawBarrageObject,
  CommanderMapKey,
  ScrollBarrageObject,
  FixedBarrageObejct
} from '../types'

export default {
  clear(this: BarrageMaker) {
    const { width, height } = this.canvas!
    this._forEachManager(manager => manager.reset())
    this.ctx!.clearRect(0, 0, width, height)
  },
  add(this: BarrageMaker, barrage: RawBarrageObject, type: CommanderMapKey = 'scroll') {
    const { text, color, size } = barrage
    const ctx = this.ctx!
    const fontSize = (size || this.config.fontSize) * this.config.zoom
    const fontColor = color || this.config.fontColor

    ctx.font = `${fontSize}px 'Microsoft Yahei'`
    const { width } = ctx.measureText(text)
    if (type === 'scroll') {
      const barrageObject: ScrollBarrageObject = {
        text,
        width,
        color: fontColor,
        size: fontSize,
        speed: 0,
        offset: 0
      }
      this.commanderMap[type].waitingQueue.push(barrageObject)
    } else {
      const barrageObject: FixedBarrageObejct = {
        text,
        width,
        color: fontColor,
        size: fontSize,
        duration: 0,
        offset: 0
      }
      this.commanderMap[type].waitingQueue.push(barrageObject)
    }
  },
  _render(this: BarrageMaker) {
    const ctx = this.ctx!
    const canvas = this.canvas!
    ctx.shadowBlur = 2
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this._forEachManager(manager => manager.render())

    this.animation = requestAnimationFrame(this._render.bind(this))
  }
}
