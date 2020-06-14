import {
  BarrageConfig,
  RawBarrageObject,
  CommanderMap,
  CommanderMapKey,
  ScrollBarrageObject,
  FixedBarrageObejct,
  BarrageMouseEventHandler
} from './types'
import {
  getEl,
  requestAnimationFrame,
  cancelAnimationFrame,
  deepMerge,
  isCanvas,
  isDiv
} from './helper'
import EventEmitter from './event-emitter'
import { getEngine } from './commander'
import BaseCommander from './commander/base'
import { injectNativeEvents, injectEventsDelegator } from './event'
import { getHandler, FnMap } from './stragy'

const defaultConfig: BarrageConfig = {
  engine: 'canvas',
  zoom: 1,
  proxyObject: null,
  usePointerEvents: true,
  maxTrack: 4,
  fontSize: 20,
  fontColor: '#fff',
  duration: 10000,
  trackHeight: 20 * 1.5,
  wrapper: null
}

type BarrageConfigInit = Partial<BarrageConfig>

export default class BarrageMaker extends EventEmitter {
  el: HTMLDivElement | HTMLCanvasElement
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  config: BarrageConfig
  commanderMap: CommanderMap
  animation: number | null = null

  constructor(el: HTMLDivElement | HTMLCanvasElement | string, config?: BarrageConfigInit) {
    super()

    this.config = deepMerge(defaultConfig, config || {})

    console.log(this.config)

    this.el = getEl(el, this.config.engine)

    if (isCanvas(this.el)) {
      this.canvas = this.el
      this.ctx = this.canvas.getContext('2d')!
    }

    // 兼容性：IE11+ / 非IE基本全支持
    // pointer-events 避免上层canvas阻碍下层点击
    if (this.config.usePointerEvents) {
      this.el.style.pointerEvents = 'none'
    }

    // 获取渲染引擎
    const renderEngine = getEngine(this.config.engine)!
    const commanderConfig = {
      trackWidth: this.el.offsetWidth,
      trackHeight: this.config.trackHeight,
      maxTrack: this.config.maxTrack,
      duration: this.config.duration,
      wrapper: this.config.wrapper
    }

    const rootEle = this.config.engine === 'canvas' ? this.canvas : this.el
    this.commanderMap = {
      scroll: new renderEngine.RollingCommander(rootEle, commanderConfig),
      'fixed-top': new renderEngine.FixedTopCommander(rootEle, commanderConfig),
      'fixed-bottom': new renderEngine.FixedBottomCommander(rootEle, commanderConfig)
    }

    this.resize()

    // 注入事件控制逻辑
    injectNativeEvents(this)
    injectEventsDelegator(this)
  }

  resize(width?: number) {
    width = width || this.el.offsetWidth
    this._forEachManager(manager => manager.resize(width))
  }

  clear() {
    const fn = getHandler(this.config.engine, 'clear') as FnMap['clear']
    return fn.call(this)
  }

  setOpacity(opacity: number = 1) {
    this.el.style.opacity = `${opacity}`
  }

  setFontSize(zoom: number = 1) {
    this.config.zoom = zoom
  }

  add(barrage: RawBarrageObject, type: CommanderMapKey = 'scroll') {
    const fn = getHandler(this.config.engine, 'add') as FnMap['add']
    return fn.call(this, barrage, type)
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

  onBarrageHover(handler: BarrageMouseEventHandler) {
    if (this.config.engine === 'css3') {
      this.commanderMap['scroll'].$on('hover', handler)
      this.commanderMap['fixed-top'].$on('hover', handler)
      this.commanderMap['fixed-bottom'].$on('hover', handler)
    }
  }

  onBarrageBlur(handler: BarrageMouseEventHandler) {
    if (this.config.engine === 'css3') {
      this.commanderMap['scroll'].$on('blur', handler)
      this.commanderMap['fixed-top'].$on('blur', handler)
      this.commanderMap['fixed-bottom'].$on('blur', handler)
    }
  }

  onBarrageClick(handler: BarrageMouseEventHandler) {
    if (this.config.engine === 'css3') {
      this.commanderMap['scroll'].$on('click', handler)
      this.commanderMap['fixed-top'].$on('click', handler)
      this.commanderMap['fixed-bottom'].$on('click', handler)
    }
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
    const fn = getHandler(this.config.engine, '_render') as FnMap['_render']
    return fn.call(this)
  }
}
