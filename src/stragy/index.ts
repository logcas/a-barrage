import { RawBarrageObject, CommanderMapKey } from '../types'
import CanvasStragy from './canvas'
import Css3Stragy from './css3'

export interface FnMap {
  clear(): void
  add(barrage: RawBarrageObject, type: CommanderMapKey): void
  _render(): void
}

type FnMapKey = keyof FnMap

export function getHandler(engine: 'canvas' | 'css3', fn: FnMapKey) {
  const fnMap: FnMap = engine === 'canvas' ? CanvasStragy : Css3Stragy
  return fnMap[fn]
}
