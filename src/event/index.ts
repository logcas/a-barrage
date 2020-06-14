import BarrageMaker from '../a-barrage'
import { HTML_ELEMENT_NATIVE_EVENTS } from '../constants'

export function injectNativeEvents(instance: BarrageMaker): void {
  HTML_ELEMENT_NATIVE_EVENTS.map(eventName => {
    instance.el.addEventListener(eventName, event => {
      instance.$emit(eventName, event)
    })
  })
}

export function injectEventsDelegator(instance: BarrageMaker): void {
  const proxyObject = instance.config.proxyObject
  if (!(proxyObject instanceof HTMLElement)) {
    return
  }
  type MouseEventName =
    | 'click'
    | 'dblclick'
    | 'mousedown'
    | 'mousemove'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
  HTML_ELEMENT_NATIVE_EVENTS.map(eventName => {
    // ! 如果是联合类型 HtmlDivElement | HtmlCanvasElement 的话第二个参数会报错
    // ! 所以这里先用类型断言搞一搞
    ;(instance.el as HTMLElement).addEventListener(eventName as MouseEventName, (e: MouseEvent) => {
      const target = e.target
      if (target !== instance.el) {
        return
      }
      const event = new MouseEvent(eventName, {
        view: window,
        relatedTarget: proxyObject,
        altKey: e.altKey,
        button: e.button,
        buttons: e.buttons,
        clientX: e.clientX,
        clientY: e.clientY,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        movementX: e.movementX,
        movementY: e.movementY,
        screenX: e.screenX,
        screenY: e.screenY,
        shiftKey: e.shiftKey
      })
      proxyObject.dispatchEvent(event)
    })
  })
}
