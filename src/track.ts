import { BarrageObject } from './types'

interface TrackForEachHandler {
  (track: BarrageObject, index: number, array: BarrageObject[]): void
}

export default class BarrageTrck {
  barrages: BarrageObject[] = []
  offset: number = 0

  forEach(handler: TrackForEachHandler) {
    for (let i = 0; i < this.barrages.length; ++i) {
      handler(this.barrages[i], i, this.barrages)
    }
  }

  reset() {
    this.barrages = []
    this.offset = 0
  }

  push(...items: BarrageObject[]) {
    this.barrages.push(...items)
  }

  removeTop() {
    this.barrages.shift()
  }

  updateOffset() {
    const endBarrage = this.barrages[this.barrages.length - 1]
    if (endBarrage) {
      const { speed } = endBarrage
      this.offset -= speed
    }
  }
}
