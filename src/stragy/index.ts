import { BARRAGE_TYPE } from '../constants'
import scrollStragies from './scroll'

export const addBarrageStragy = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.add
}

export const findTrackStragy = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.find
}

export const pushBarrageStragy = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.push
}

export const renderBarrageStragy = {
  [BARRAGE_TYPE.SCROLL]: scrollStragies.render
}
