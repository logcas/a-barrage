import BarrageMaker from '../a-barrage'
import {
  RawBarrageObject,
  CommanderMapKey,
  ScrollBarrageObject,
  FixedBarrageObejct
} from '../types'
// import { createBarrage, appendChild } from '../helper/css';
// import RollingCssCommander from '../commander/css-renderer/rolling';
import { requestAnimationFrame } from '../helper'

export default {
  clear(this: BarrageMaker) {
    this._forEachManager(manager => manager.reset())
  },
  add(this: BarrageMaker, barrage: RawBarrageObject, type: CommanderMapKey = 'scroll') {
    const { text, color = this.config.fontColor, size = this.config.fontSize } = barrage
    const fontColor = color
    const fontSize = size * this.config.zoom
    const trackWidth = this.el.offsetWidth
    // const posLeft = trackWidth + 'px';

    // const danmu = createBarrage(text, fontColor, fontSize, posLeft);
    // appendChild(this.el, danmu);
    // const width = danmu.offsetWidth;
    if (type === 'scroll') {
      const barrageObject: ScrollBarrageObject = {
        text,
        width: 0,
        color: fontColor,
        size: fontSize,
        speed: 0,
        offset: trackWidth
      }
      // (this.commanderMap[type] as RollingCssCommander).objToElm.set(barrageObject, danmu);
      this.commanderMap[type].waitingQueue.push(barrageObject)
    } else {
      const barrageObject: FixedBarrageObejct = {
        text,
        width: 0,
        color: fontColor,
        size: fontSize,
        duration: this.config.duration,
        offset: trackWidth
      }
      this.commanderMap[type].waitingQueue.push(barrageObject)
    }
  },
  _render(this: BarrageMaker) {
    this._forEachManager(manager => manager.render())

    this.animation = requestAnimationFrame(this._render.bind(this))
  }
}
