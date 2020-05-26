import EventEmitter from '../src/event-emitter'

describe('event-emitter', () => {
  test('$on', () => {
    const emt = new EventEmitter()
    const EVENT_1 = 'event1'
    const EVENT_2 = 'event2'
    const fn1 = jest.fn(() => {})
    const fn2 = jest.fn(() => {})
    emt.$on(EVENT_1, fn1)
    emt.$on(EVENT_1, fn2)
    emt.$on(EVENT_2, fn1)
    emt.$emit(EVENT_1)
    emt.$emit(EVENT_2)
    emt.$emit(EVENT_1)
    expect(fn1.mock.calls.length).toBe(3)
    expect(fn2.mock.calls.length).toBe(2)
  })

  test('$once', () => {
    const emt = new EventEmitter()
    const EVENT_1 = 'event1'
    const fn1 = jest.fn(() => {})
    emt.$once(EVENT_1, fn1)
    emt.$emit(EVENT_1)
    emt.$emit(EVENT_1)
    expect(fn1.mock.calls.length).toBe(1)
  })

  test('$off', () => {
    const emt = new EventEmitter()
    const EVENT_1 = 'event1'
    const EVENT_2 = 'event2'
    const fn1 = jest.fn(() => {})
    const fn2 = jest.fn(() => {})
    emt.$on(EVENT_1, fn1)
    emt.$on(EVENT_1, fn2)
    emt.$on(EVENT_2, fn1)
    emt.$on(EVENT_2, fn2)
    emt.$off(EVENT_2)
    emt.$off(EVENT_1, fn1)
    emt.$off('dasa', fn1)
    emt.$emit(EVENT_1)
    emt.$emit(EVENT_2)
    expect(fn1.mock.calls.length).toBe(0)
    expect(fn2.mock.calls.length).toBe(1)
  })

  test('$emit', () => {
    const emt = new EventEmitter()
    const EVENT_1 = 'event1'
    const fn1 = jest.fn(() => {})
    const fn2 = jest.fn(() => {})
    emt.$on(EVENT_1, fn1).$on(EVENT_1, fn2)
    emt.$emit(EVENT_1)
    expect(fn1.mock.calls.length).toBe(1)
    expect(fn1.mock.calls.length).toBe(1)
  })
})
