import {
  BarrageConfig,
  RawBarrageObject,
  CommanderMap,
  CommanderMapKey,
  ScrollBarrageObject,
  FixedBarrageObejct
} from './types'
import { getEl, requestAnimationFrame, cancelAnimationFrame, deepMerge } from './helper'
import EventEmitter from './event-emitter'
import { HTML_ELEMENT_NATIVE_EVENTS } from './constants'
import { getEngine } from './commander'
import BaseCommander from './commander/base'

const defaultConfig: BarrageConfig = {
  engine: 'canvas',
  zoom: 1,
  proxyObject: null,
  usePointerEvents: true,
  maxTrack: 4,
  fontSize: 20,
  fontColor: '#fff',
  duration: 10000,
  trackHeight: 20 * 1.5
}

type BarrageConfigInit = Partial<BarrageConfig>

export default class BarrageMaker extends EventEmitter {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  config: BarrageConfig
  commanderMap: CommanderMap
  animation: number | null = null

  constructor(el: HTMLElement | string, config?: BarrageConfigInit) {
    super()

    const canvas = getEl(el)
    if (!canvas) {
      throw new Error('wrapper is not a HTMLElement')
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('el must be a HTMLCanvasElement!')
    }

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
    this.config = deepMerge(defaultConfig, config || {})

    // 兼容性：IE11+ / 非IE基本全支持
    // pointer-events 避免上层canvas阻碍下层点击
    if (this.config.usePointerEvents) {
      this.canvas.style.pointerEvents = 'none'
    }

    // 获取渲染引擎
    const renderEngine = getEngine(this.config.engine)!
    const commanderConfig = {
      trackWidth: this.canvas.width,
      trackHeight: this.config.trackHeight,
      maxTrack: this.config.maxTrack,
      duration: this.config.duration
    }

    this.commanderMap = {
      scroll: new renderEngine.RollingCommander(this.canvas, commanderConfig),
      'fixed-top': new renderEngine.FixedTopCommander(this.canvas, commanderConfig),
      'fixed-bottom': new renderEngine.FixedBottomCommander(this.canvas, commanderConfig)
    }

    this.resize()
    this._bindNativeEvents()
    this._delegateEvents()
  }

  resize(width?: number) {
    width = width || this.canvas.width
    this._forEachManager(manager => manager.resize(width))
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

  add(barrage: RawBarrageObject, type: CommanderMapKey = 'scroll') {
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
      commander: BaseCommander<ScrollBarrageObject> | BaseCommander<FixedBarrageObejct>
    ) => any
  ) {
    Object.keys(this.commanderMap).forEach(key =>
      handler.call(this, this.commanderMap[key as CommanderMapKey])
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