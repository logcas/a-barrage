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
