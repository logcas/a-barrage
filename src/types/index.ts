export interface BarrageConfig {
  maxTrack: number
  fontSize: number
  fontColor: string
  duration: number
  trackHeight: number
  zoom: number
  proxyObject: HTMLElement | null
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
