import TrackManager from '../track-manager'

export interface GeneralTrackConfig {
  maxTrack: number
  fontSize: number
  fontColor: string
  duration: number
  trackHeight: number
}

export interface BarrageConfig extends GeneralTrackConfig {
  zoom: number
  proxyObject: HTMLElement | null
  usePointerEvents: boolean
  scroll: GeneralTrackConfig
  fixedTop: GeneralTrackConfig
  fixedBottom: GeneralTrackConfig
}

export type BarrageConfigInit =
  | Partial<BarrageConfig>
  | {
      scroll?: Partial<GeneralTrackConfig>
      fixedTop?: Partial<GeneralTrackConfig>
      fixedBottom?: Partial<GeneralTrackConfig>
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
  speed: number
  offset: number
}

export interface TrackManagerMap {
  scroll: TrackManager
  'fixed-top': TrackManager
  'fixed-bottom': TrackManager
}

export type TrackManagerMapKey = keyof TrackManagerMap
