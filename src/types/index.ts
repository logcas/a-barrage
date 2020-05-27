import TrackManager from '../track-manager'

export interface BarrageConfig {
  zoom: number
  proxyObject: HTMLElement | null
  usePointerEvents: boolean
  maxTrack: number
  fontSize: number
  fontColor: string
  duration: number
  trackHeight: number
}

export interface RawBarrageObject {
  text: string
  color?: string
  size?: number
}

export interface BarrageObject {
  text: string
  color: string
  size: number
  width: number
  offset: number
}

export interface ScrollBarrageObject extends BarrageObject {
  speed: number
}

export interface FixedBarrageObejct extends BarrageObject {
  duration: number
}

export interface TrackManagerMap {
  scroll: TrackManager<ScrollBarrageObject>
  'fixed-top': TrackManager<FixedBarrageObejct>
  'fixed-bottom': TrackManager<FixedBarrageObejct>
}

export type TrackManagerMapKey = keyof TrackManagerMap
