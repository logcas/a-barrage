import TrackManager from '../track-manager'
import { FixedBarrageObejct, ScrollBarrageObject } from '../types'

export default {
  push(this: TrackManager<ScrollBarrageObject | FixedBarrageObejct>) {
    let isIntered: boolean
    for (let i = 0; i < this.waitingQueue.length; ) {
      isIntered = this.add(this.waitingQueue[i])
      if (!isIntered) {
        break
      }
      this.waitingQueue.shift()
    }
  }
}
