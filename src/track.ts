import { BarrageObject } from './types'
import { isScrollBarrage } from './helper'

interface TrackForEachHandler<T extends BarrageObject> {
  (track: T, index: number, array: T[]): void
}

export default class BarrageTrack<T extends BarrageObject> {
  barrages: T[] = []
  offset: number = 0

  forEach(handler: TrackForEachHandler<T>) {
    for (let i = 0; i < this.barrages.length; ++i) {
      handler(this.barrages[i], i, this.barrages)
    }
  }

  reset() {
    this.barrages = []
    this.offset = 0
  }

  push(...items: T[]) {
    this.barrages.push(...items)
  }

  removeTop() {
    this.barrages.shift()
  }

  updateOffset() {
    const endBarrage = this.barrages[this.barrages.length - 1]
    if (endBarrage && isScrollBarrage(endBarrage)) {
      const { speed } = endBarrage
      this.offset -= speed
    }
  }
}
