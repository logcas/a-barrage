import TrackManager from '../track-manager'

export interface BarrageConfig {
  maxTrack: number
  fontSize: number
  fontColor: string
  duration: number
  trackHeight: number
  zoom: number
  proxyObject: HTMLElement | null
  usePointerEvents: boolean
}

export type BarrageConfigInit = Partial<BarrageConfig>

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
  speed: number
  offset: number
}

export interface TrackManagerMap {
  scroll: TrackManager
  'fixed-top': TrackManager
  'fixed-bottom': TrackManager
}

export type TrackManagerMapKey = keyof TrackManagerMap
