import { BarrageObject, CommanderConfig } from '../types'
import Track from '../track'

interface CommanderForEachHandler<T extends BarrageObject> {
  (track: Track<T>, index: number, array: Track<T>[]): void
}

export default abstract class BaseCommander<T extends BarrageObject> {
  protected trackWidth: number
  protected trackHeight: number
  protected duration: number
  protected tracks: Track<T>[] = []
  waitingQueue: T[] = []

  constructor(config: CommanderConfig) {
    this.trackWidth = config.trackWidth
    this.trackHeight = config.trackHeight
    this.duration = config.duration

    for (let i = 0; i < config.maxTrack; ++i) {
      this.tracks[i] = new Track()
    }
  }

  forEach(handler: CommanderForEachHandler<T>) {
    for (let i = 0; i < this.tracks.length; ++i) {
      handler(this.tracks[i], i, this.tracks)
    }
  }

  reset() {
    this.forEach(track => track.reset())
  }

  resize(width?: number, height?: number) {
    if (width) {
      this.trackWidth = width
    }
    if (height) {
      this.trackHeight = height
    }
  }

  // 添加弹幕到等待队列
  abstract add(barrage: T): boolean
  // 寻找合适的轨道
  abstract _findTrack(): number
  // 从等待队列中抽取弹幕并放入弹幕
  abstract _extractBarrage(): void
  // 渲染函数
  abstract render(): void
}
