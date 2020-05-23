export function isEmptyArray<T>(array: T[]): boolean {
  return array.length === 0
}

export function getArrayRight<T>(array: T[]): T {
  return array[array.length - 1]
}

export const TIME_PER_FRAME = 16.6

export function getEl(el: HTMLElement | string): HTMLElement | null {
  if (el instanceof HTMLElement) {
    return el
  }
  return document.querySelector(el)
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
        if (isObject(obj[key])) {
          ret[key] = deepMerge(ret[key], obj[key])
        } else {
          ret[key] = obj[key]
        }
      }
    })
  })
  return ret
}
