// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { BarrageConfig, RawBarrageObject, InitialBarrageConfig, BarrageObject } from './types'
import TrackManager from './track-manager'
import { getEl, requestAnimationFrame, cancelAnimationFrame } from './helper'

const defaultConfig: BarrageConfig = {
  maxTrack: 4,
  fontSize: 20,
  fontColor: '#fff',
  duration: 10000,
  trackHeight: 20 * 1.5,
  zoom: 1
}

export default class BarrageMaker {
  el: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  config: BarrageConfig
  trackManager: TrackManager
  waitingQueue: BarrageObject[] = []
  animation: number | null = null

  constructor(wrapper: HTMLElement | string, config?: InitialBarrageConfig) {
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
    this.config = Object.assign({}, defaultConfig, config || {})

    this.el.appendChild(this.canvas)

    this.trackManager = new TrackManager(
      this.canvas.width,
      this.config.trackHeight,
      this.config.maxTrack,
      this.config.duration
    )

    this.resize()
  }

  resize(width?: number) {
    width = width || this.el.offsetWidth
    this.canvas.width = width
    this.canvas.height = this.config.maxTrack * this.config.trackHeight * 1.5
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = this.canvas.height + 'px'
    this.trackManager.trackHeight = this.canvas.height
    this.trackManager.trackWidth = this.canvas.width
  }

  clear() {
    const { width, height } = this.canvas
    this.trackManager.reset()
    this.ctx.clearRect(0, 0, width, height)
  }

  setOpacity(opacity: number = 1) {
    this.canvas.style.opacity = `${opacity}`
  }

  setFontSize(zoom: number = 1) {
    this.config.zoom = zoom
  }

  add(barrage: RawBarrageObject) {
    const { text, color, size } = barrage
    const ctx = this.ctx
    const fontSize = (size || this.config.fontSize) * this.config.zoom
    const fontColor = color || this.config.fontColor

    ctx.font = `${fontSize}px 'Microsoft Yahei'`
    const { width } = ctx.measureText(text)
    const barrageObject: BarrageObject = {
      text,
      width,
      color: fontColor,
      size: fontSize,
      speed: 0,
      offset: 0
    }
    this.waitingQueue.push(barrageObject)
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

  _pushValidBarrage() {
    let isIntered: boolean
    for (let i = 0; i < this.waitingQueue.length; ) {
      isIntered = this.trackManager.add(this.waitingQueue[i])
      if (!isIntered) {
        break
      }
      this.waitingQueue.shift()
    }
  }

  _render() {
    const ctx = this.ctx
    ctx.shadowBlur = 2
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this._pushValidBarrage()
    const trackHeight = this.config.trackHeight

    this.trackManager.forEach((track, trackIndex) => {
      let removeTop = false
      track.forEach((barrage, barrageIndex) => {
        const { color, text, offset, speed, width, size } = barrage
        ctx.fillStyle = color
        ctx.font = `${size}px 'Microsoft Yahei'`
        ctx.fillText(text, offset, (trackIndex + 1) * trackHeight)
        barrage.offset -= speed
        if (barrageIndex === 0 && barrage.offset < 0 && Math.abs(barrage.offset) >= width) {
          removeTop = true
        }
      })
      track.updateOffset()
      if (removeTop) {
        track.removeTop()
      }
    })

    this.animation = requestAnimationFrame(this._render.bind(this))
  }
}
