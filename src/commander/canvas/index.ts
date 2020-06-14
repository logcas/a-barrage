import FixedTopCommander from './fixed-top'
import FixedBottomCommander from './fixed-bottom'
import RollingCommander from './rolling'
import { RenderEngine } from '../../types'

const engine: RenderEngine = {
  FixedBottomCommander,
  FixedTopCommander,
  RollingCommander
}

export default engine
