import { ScrollBarrageObject, FixedBarrageObejct } from '../types'

export function isEmptyArray<T>(array: T[]): boolean {
  return array.length === 0
}

export function getArrayRight<T>(array: T[]): T {
  return array[array.length - 1]
}

export function isDiv(el: any): el is HTMLDivElement {
  return el instanceof HTMLDivElement
}

export function isCanvas(el: any): el is HTMLCanvasElement {
  return el instanceof HTMLCanvasElement
}

export function getEl(
  el: HTMLDivElement | HTMLCanvasElement | string,
  type: 'css3' | 'canvas'
): HTMLDivElement | HTMLCanvasElement {
  const $ = document.querySelector
  let _el = typeof el === 'string' ? $(el) : el
  if (type === 'canvas' && !isCanvas(_el)) {
    throwElError('canvas')
  }
  if (type === 'css3' && !isDiv(_el)) {
    throwElError('css3')
  }

  return _el as HTMLCanvasElement | HTMLDivElement

  function throwElError(type: 'canvas' | 'css3'): never {
    const EL_TYPE = type === 'canvas' ? 'HTMLCanvasElement' : 'HTMLDivElement'
    throw new Error(`Engine Error: el is not a ${EL_TYPE} instance.(engine: ${type})`)
  }
}

export const requestAnimationFrame =
  window.requestAnimationFrame || window.webkitRequestAnimationFrame

export const cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame

export const isFunction = function(fn: any): fn is Function {
  return typeof fn === 'function'
}

export const isNull = function(o: any): o is null {
  return o === null
}

export const isUndefined = function(o: any): o is undefined {
  return typeof o === 'undefined'
}

export const isObject = function(o: any): o is object {
  return typeof o === 'object' && o !== null
}

export function deepMerge(...objects: any[]): any {
  const ret: any = {}
  objects.forEach(obj => {
    if (isNull(obj) || isUndefined(obj)) {
      return
    }
    Object.keys(obj).forEach((key: string) => {
      if (!ret.hasOwnProperty(key)) {
        ret[key] = obj[key]
      } else {
        if (Array.isArray(obj[key])) {
          ret[key] = obj[key]
        } else if (isObject(obj[key])) {
          ret[key] = deepMerge(ret[key], obj[key])
        } else {
          ret[key] = obj[key]
        }
      }
    })
  })
  return ret
}

export function isScrollBarrage(x: any): x is ScrollBarrageObject {
  return x.hasOwnProperty('speed') && x.hasOwnProperty('offset')
}

export function isFixedBarrage(x: any): x is FixedBarrageObejct {
  return x.hasOwnProperty('duration')
}
