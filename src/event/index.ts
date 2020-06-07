import BarrageMaker from '../a-barrage'
import { HTML_ELEMENT_NATIVE_EVENTS } from '../constants'

export function injectNativeEvents(instance: BarrageMaker): void {
  HTML_ELEMENT_NATIVE_EVENTS.map(eventName => {
    instance.canvas.addEventListener(eventName, event => {
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
    instance.canvas.addEventListener(eventName as MouseEventName, (e: MouseEvent) => {
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
