import BaseCommander from '../base'
import { BarrageObject, CommanderConfig } from '../../types'
import { setHoverStyle, setBlurStyle, createBarrage as _createBarrage } from '../../helper/css'
export default abstract class BaseCssCommander<T extends BarrageObject> extends BaseCommander<T> {
  el: HTMLDivElement
  objToElm: WeakMap<T, HTMLElement> = new WeakMap()
  elmToObj: WeakMap<HTMLElement, T> = new WeakMap()
  freezeBarrage: T | null = null
  domPool: Array<HTMLElement> = []

  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(config)

    this.el = el

    const wrapper = config.wrapper
    if (wrapper && config.interactive) {
      wrapper.addEventListener('mousemove', this._mouseMoveEventHandler.bind(this))
      wrapper.addEventListener('click', this._mouseClickEventHandler.bind(this))
    }
  }

  createBarrage(text: string, color: string, fontSize: string, left: string) {
    if (this.domPool.length) {
      const el = this.domPool.pop()
      return _createBarrage(text, color, fontSize, left, el)
    } else {
      return _createBarrage(text, color, fontSize, left)
    }
  }

  removeElement(target: HTMLElement) {
    if (this.domPool.length < this.poolSize) {
      this.domPool.push(target)
      return
    }
    this.el.removeChild(target)
  }

  _mouseMoveEventHandler(e: Event) {
    const target = e.target
    if (!target) {
      return
    }

    const newFreezeBarrage = this.elmToObj.get(target as HTMLElement)
    const oldFreezeBarrage = this.freezeBarrage

    if (newFreezeBarrage === oldFreezeBarrage) {
      return
    }

    this.freezeBarrage = null

    if (newFreezeBarrage) {
      this.freezeBarrage = newFreezeBarrage
      newFreezeBarrage.freeze = true
      setHoverStyle(target as HTMLElement)
      this.$emit('hover', newFreezeBarrage, target as HTMLElement)
    }

    if (oldFreezeBarrage) {
      oldFreezeBarrage.freeze = false
      const oldFreezeElm = this.objToElm.get(oldFreezeBarrage)
      oldFreezeElm && setBlurStyle(oldFreezeElm)
      this.$emit('blur', oldFreezeBarrage, oldFreezeElm)
    }
  }

  _mouseClickEventHandler(e: Event) {
    const target = e.target
    const barrageObject = this.elmToObj.get(target as HTMLElement)
    if (barrageObject) {
      this.$emit('click', barrageObject, target)
    }
  }

  reset() {
    this.forEach(track => {
      track.forEach(barrage => {
        const el = this.objToElm.get(barrage)
        if (!el) {
          return
        }
        this.removeElement(el)
      })
      track.reset()
    })
  }
}
