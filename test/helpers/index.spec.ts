import {
  isEmptyArray,
  getArrayRight,
  getEl,
  isFunction,
  isUndefined,
  isObject,
  deepMerge,
  isScrollBarrage,
  isFixedBarrage,
  requestAnimationFrame,
  cancelAnimationFrame
} from '../../src/helper'

describe('helpers test', () => {
  test('isEmptyArray', () => {
    const a: number[] = []
    const b: number[] = [1]
    expect(isEmptyArray(a)).toBeTruthy()
    expect(isEmptyArray(b)).toBeFalsy()
  })

  test('getArrayRight', () => {
    const a: number[] = [1, 2]
    const b: number[] = []
    expect(getArrayRight(a)).toBe(2)
    expect(getArrayRight(b)).toBeUndefined()
  })

  test('getEl', () => {
    const id = 'abcd'
    const el = document.createElement('div')
    el.id = id
    document.body.append(el)
    expect(getEl(`#${id}`)).toBe(el)
    expect(getEl(el)).toBe(el)
    expect(getEl('#aaa')).toBeNull()
  })

  test('isFunction', () => {
    const fn = () => {}
    const fn2 = {}
    expect(isFunction(fn)).toBeTruthy()
    expect(isFunction(fn2)).toBeFalsy()
  })

  test('isUndefined', () => {
    const a = undefined
    const b = {}
    const c = null
    expect(isUndefined(a)).toBeTruthy()
    expect(isUndefined(b)).toBeFalsy()
    expect(isUndefined(c)).toBeFalsy()
  })

  test('isObject', () => {
    const a = {}
    const b = new Date()
    const c = null
    const d = 1
    expect(isObject(a)).toBeTruthy()
    expect(isObject(b)).toBeTruthy()
    expect(isObject(c)).toBeFalsy()
    expect(isObject(d)).toBeFalsy()
  })

  test('deepMerge', () => {
    const obj1 = {
      a: 123,
      b: [1, 2, 3],
      c: {
        a: 1,
        b: 2,
        c: {
          a: 3,
          b: 4
        }
      },
      d: null
    }
    const obj2 = {
      a: 456,
      b: [1],
      c: {
        d: 3
      },
      f: undefined
    }
    const merged = deepMerge(obj1, obj2, undefined, null)
    expect(merged).toEqual({
      a: 456,
      b: [1],
      c: {
        a: 1,
        b: 2,
        c: {
          a: 3,
          b: 4
        },
        d: 3
      },
      d: null,
      f: undefined
    })
    const merged2 = deepMerge(null, undefined)
    expect(merged2).toEqual({})
  })

  test('isScrollBarrage', () => {
    const a = {
      speed: 21,
      offset: 0
    }
    const b = {
      speed: 21
    }
    expect(isScrollBarrage(a)).toBeTruthy()
    expect(isScrollBarrage(b)).toBeFalsy()
  })

  test('isFixedBarrage', () => {
    const a = {
      duration: 132
    }
    const b = {
      speed: 12
    }
    expect(isFixedBarrage(a)).toBeTruthy()
    expect(isFixedBarrage(b)).toBeFalsy()
  })

  test('requestAnimationFrame', done => {
    const callback = jest.fn(() => {})
    const handler = requestAnimationFrame(callback)
    setTimeout(() => {
      expect(callback.mock.calls.length).toBe(1)
      expect(typeof handler).toBe('number')
      done()
    }, 1000)
  })

  test('cancelAnimationFrame', done => {
    const callback = jest.fn(() => {})
    const handler = requestAnimationFrame(callback)
    cancelAnimationFrame(handler)
    setTimeout(() => {
      expect(callback.mock.calls.length).toBe(0)
      done()
    }, 1000)
  })
})
