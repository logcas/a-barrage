import { CommanderMapKey } from '../types'

export const HTML_ELEMENT_NATIVE_EVENTS = 'click,dblclick,mousedown,mousemove,mouseout,mouseover,mouseup'.split(
  ','
)

interface BarrageTypeObject {
  SCROLL: CommanderMapKey
  FIXED_TOP: CommanderMapKey
  FIXED_BOTTOM: CommanderMapKey
}

export const BARRAGE_TYPE: BarrageTypeObject = {
  SCROLL: 'scroll',
  FIXED_TOP: 'fixed-top',
  FIXED_BOTTOM: 'fixed-bottom'
}

export const TIME_PER_FRAME = 16.6
