import BaseCommander from '../base'
import { BarrageObject, CommanderConfig } from '../../types'
import { setHoverStyle, setUnhoverStyle } from '../../helper/css'

export default abstract class BaseCssCommander<T extends BarrageObject> extends BaseCommander<T> {
  el: HTMLDivElement
  objToElm: WeakMap<T, HTMLElement> = new WeakMap()
  elmToObj: WeakMap<HTMLElement, T> = new WeakMap()
  freezeBarrage: T | null = null

  constructor(el: HTMLDivElement, config: CommanderConfig) {
    super(config)

    this.el = el

    const wrapper = config.wrapper
    if (wrapper) {
      wrapper.addEventListener('mousemove', this._mouseMoveEventHandler.bind(this))
    }
  }

  removeElement(target: HTMLElement) {
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
      oldFreezeElm && setUnhoverStyle(oldFreezeElm)
      this.$emit('blur', oldFreezeBarrage, oldFreezeElm)
    }
  }
}
