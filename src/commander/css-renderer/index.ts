import FixedTopCommander from './fixed-top'
import RollingCommander from './rolling'
import { RenderEngine } from '../../types'

const engine: RenderEngine = {
  FixedTopCommander,
  FixedBottomCommander: FixedTopCommander,
  RollingCommander
}

export default engine
