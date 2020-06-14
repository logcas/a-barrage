import CanvasEngine from './canvas'
import CssEngine from './css-renderer'
import { RenderEngine } from '../types'

export function getEngine(type: string): RenderEngine | null {
  if (type === 'canvas') {
    return CanvasEngine
  }
  if (type === 'css3') {
    return CssEngine
  }
  return null
}
