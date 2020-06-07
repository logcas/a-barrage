import CanvasEngine from './canvas'
import { RenderEngine } from '../types'

export function getEngine(type: string): RenderEngine | null {
  if (type === 'canvas') {
    return CanvasEngine
  }
  return null
}
