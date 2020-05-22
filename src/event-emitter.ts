interface EventMap {
  [x: string]: Array<EventHandler>
}

interface EventHandler {
  (...args: any[]): any
}

export default class EventEmitter {
  private _eventsMap: EventMap = {}

  $on(eventName: string, handler: EventHandler) {
    const eventsMap = this._eventsMap
    const handlers = eventsMap[eventName] || (eventsMap[eventName] = [])
    handlers.push(handler)
    return this
  }

  $once(eventName: string, handler: EventHandler) {
    const eventsMap = this._eventsMap
    const handlers = eventsMap[eventName] || (eventsMap[eventName] = [])
    const self = this
    const fn = function(...args: any[]) {
      handler(...args)
      self.$off(eventName, fn)
    }
    handlers.push(fn)
    return this
  }

  $off(eventName: string, handler?: EventHandler) {
    const eventsMap = this._eventsMap
    if (!handler) {
      eventsMap[eventName].length = 0
      return this
    }

    const handlers = eventsMap[eventName]
    if (!handlers) {
      return this
    }

    const index = handlers.indexOf(handler)
    if (index !== -1) {
      handlers.splice(index, 1)
    }

    return this
  }

  $emit(eventName: string, ...args: any[]) {
    const eventsMap = this._eventsMap
    const handlers = eventsMap[eventName]
    if (Array.isArray(handlers)) {
      handlers.forEach(fn => fn(...args))
    }
  }
}
