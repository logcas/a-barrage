import { BARRAGE_TYPE } from '../constants'
import scrollStragies from './scroll'
import fixedStragies from './fixed'
import globalStragies from './global'

export const addBarrageStragy: any = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.add,
  [BARRAGE_TYPE.FIXED_TOP]: fixedStragies.add,
  [BARRAGE_TYPE.FIXED_BOTTOM]: fixedStragies.add
}

export const findTrackStragy: any = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.find,
  [BARRAGE_TYPE.FIXED_TOP]: fixedStragies.find,
  [BARRAGE_TYPE.FIXED_BOTTOM]: fixedStragies.find
}

export const pushBarrageStragy: any = {
  [BARRAGE_TYPE.SCROLL]: globalStragies.push,
  [BARRAGE_TYPE.FIXED_BOTTOM]: globalStragies.push,
  [BARRAGE_TYPE.FIXED_TOP]: globalStragies.push
}

export const renderBarrageStragy: any = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.render,
  [BARRAGE_TYPE.FIXED_TOP]: fixedStragies.renderTop,
  [BARRAGE_TYPE.FIXED_BOTTOM]: fixedStragies.renderBottom
}
