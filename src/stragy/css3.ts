import BarrageMaker from '../a-barrage'
import { RawBarrageObject, CommanderMapKey } from '../types'

export default {
  clear(this: BarrageMaker) {},
  add(this: BarrageMaker, barrage: RawBarrageObject, type: CommanderMapKey = 'scroll') {},
  _render(this: BarrageMaker) {}
}
