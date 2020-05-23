import { TrackManagerMapKey } from '../types'

export const HTML_ELEMENT_NATIVE_EVENTS = 'click,dblclick,mousedown,mousemove,mouseout,mouseover,mouseup'.split(
  ','
)

interface BarrageTypeObject {
  SCROLL: TrackManagerMapKey
  FIXED_TOP: TrackManagerMapKey
  FIXED_BOTTOM: TrackManagerMapKey
}

export const BARRAGE_TYPE: BarrageTypeObject = {
  SCROLL: 'scroll',
  FIXED_TOP: 'fixed-top',
  FIXED_BOTTOM: 'fixed-bottom'
}
