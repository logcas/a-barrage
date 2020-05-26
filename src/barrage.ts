import {
  BarrageConfig,
  RawBarrageObject,
  BarrageConfigInit,
  BarrageObject,
  TrackManagerMap,
  TrackManagerMapKey,
  GeneralTrackConfig,
  ScrollBarrageObject,
  FixedBarrageObejct
} from './types'
import TrackManager from './track-manager'
import { getEl, requestAnimationFrame, cancelAnimationFrame, deepMerge } from './helper'
import EventEmitter from './event-emitter'
import { HTML_ELEMENT_NATIVE_EVENTS } from './constants'

const generalDefaultConfig: GeneralTrackConfig = {
  maxTrack: 4,
  fontSize: 20,
  fontColor: '#fff',
  duration: 10000,
  trackHeight: 20 * 1.5
}

const defaultConfig: BarrageConfig = {
  zoom: 1,
  proxyObject: null,
  usePointerEvents: true,
  scroll: generalDefaultConfig,
  fixedTop: generalDefaultConfig,
  fixedBottom: generalDefaultConfig,
  ...generalDefaultConfig
}

export default class BarrageMaker extends EventEmitter {
  el: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  config: BarrageConfig
  trackManagerMap: TrackManagerMap
  animation: number | null = null

  constructor(wrapper: HTMLElement | string, config?: BarrageConfigInit) {
    super()

    const el = getEl(wrapper)
    if (!el) {
      throw new Error('wrapper is not a HTMLElement')
    }

    this.el = el
    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.ctx = this.canvas.getContext('2d')!
    this.config = deepMerge(defaultConfig, config || {})

    // 兼容性：IE11+ / 非IE基本全支持
    // pointer-events 避免上层canvas阻碍下层点击
    if (this.config.usePointerEvents) {
      this.canvas.style.pointerEvents = 'none'
    }

    this.el.appendChild(this.canvas)

    this.trackManagerMap = {
      scroll: new TrackManager<ScrollBarrageObject>(this.canvas, {
        trackWidth: this.canvas.width,
        trackHeight: this.config.trackHeight,
        numbersOfTrack: this.config.maxTrack,
        duration: this.config.duration,
        type: 'scroll'
      }),
      'fixed-top': new TrackManager<FixedBarrageObejct>(this.canvas, {
        trackWidth: this.canvas.width,
        trackHeight: this.config.trackHeight,
        numbersOfTrack: this.config.maxTrack,
        duration: this.config.duration,
        type: 'fixed-top'
      }),
      'fixed-bottom': new TrackManager<FixedBarrageObejct>(this.canvas, {
        trackWidth: this.canvas.width,
        trackHeight: this.config.trackHeight,
        numbersOfTrack: this.config.maxTrack,
        duration: this.config.duration,
        type: 'fixed-bottom'
      })
    }

    this.resize()
    this._bindNativeEvents()
    this._delegateEvents()
  }

  resize(width?: number, height?: number) {
    width = width || this.el.offsetWidth
    height = height || this.el.offsetHeight
    this.canvas.width = width
    this.canvas.height = height
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = this.canvas.height + 'px'
    this._forEachManager(manager => manager.resize(this.canvas.width))
  }

  clear() {
    const { width, height } = this.canvas
    this._forEachManager(manager => manager.reset())
    this.ctx.clearRect(0, 0, width, height)
  }

  setOpacity(opacity: number = 1) {
    this.canvas.style.opacity = `${opacity}`
  }

  setFontSize(zoom: number = 1) {
    this.config.zoom = zoom
  }

  add(barrage: RawBarrageObject, type: TrackManagerMapKey = 'scroll') {
    const { text, color, size } = barrage
    const ctx = this.ctx
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
      this.trackManagerMap[type].waitingQueue.push(barrageObject)
    } else {
      const barrageObject: FixedBarrageObejct = {
        text,
        width,
        color: fontColor,
        size: fontSize,
        duration: 0,
        offset: 0
      }
      this.trackManagerMap[type].waitingQueue.push(barrageObject)
    }
  }

  start() {
    if (this.animation) {
      return
    }
    this.animation = requestAnimationFrame(this._render.bind(this))
  }

  stop() {
    if (!this.animation) {
      return
    }
    cancelAnimationFrame(this.animation)
    this.animation = null
  }

  _forEachManager(
    handler: (
      trackManager: TrackManager<ScrollBarrageObject> | TrackManager<FixedBarrageObejct>
    ) => any
  ) {
    Object.keys(this.trackManagerMap).forEach(key =>
      handler.call(this, this.trackManagerMap[key as TrackManagerMapKey])
    )
  }

  _render() {
    const ctx = this.ctx
    ctx.shadowBlur = 2
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this._forEachManager(manager => manager.render())

    this.animation = requestAnimationFrame(this._render.bind(this))
  }

  _bindNativeEvents() {
    HTML_ELEMENT_NATIVE_EVENTS.map(eventName => {
      this.canvas.addEventListener(eventName, event => {
        this.$emit(eventName, event)
      })
    })
  }

  _delegateEvents() {
    const proxyObject = this.config.proxyObject
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
      this.canvas.addEventListener(eventName as MouseEventName, (e: MouseEvent) => {
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
}
