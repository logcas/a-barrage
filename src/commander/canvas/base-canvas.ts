import BaseCommander from '../base'
import { BarrageObject, CommanderConfig } from '../../types'

export default abstract class BaseCanvasCommander<T extends BarrageObject> extends BaseCommander<
  T
> {
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement, config: CommanderConfig) {
    super(config)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  reset() {
    this.forEach(track => track.reset())
  }
}
