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
