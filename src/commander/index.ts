import CanvasEngine from './canvas'
import CssEngine from './css-renderer'
import { RenderEngine } from '../types'

export function getEngine(type: 'canvas' | 'css3'): RenderEngine {
  if (type === 'canvas') {
    return CanvasEngine
  }
  return CssEngine
}
