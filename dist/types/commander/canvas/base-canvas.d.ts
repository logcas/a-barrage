import BaseCommander from '../base';
import { BarrageObject, CommanderConfig } from '../../types';
export default abstract class BaseCanvasCommander<T extends BarrageObject> extends BaseCommander<T> {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, config: CommanderConfig);
    reset(): void;
}
