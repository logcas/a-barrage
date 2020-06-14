import FixedTopCommander from './fixed-top'
import RollingCommander from './rolling'
import FixedBottomCommander from './fixed-bottom'
import { RenderEngine } from '../../types'

const engine: RenderEngine = {
  FixedTopCommander,
  FixedBottomCommander,
  RollingCommander
}

export default engine
