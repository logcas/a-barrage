import BaseCanvasCommander from './base-canvas';
import { FixedBarrageObejct, CommanderConfig } from '../../types';
export default abstract class BaseFixedCommander extends BaseCanvasCommander<FixedBarrageObejct> {
    constructor(canvas: HTMLCanvasElement, config: CommanderConfig);
    add(barrage: FixedBarrageObejct): boolean;
    _findTrack(): number;
    _extractBarrage(): void;
}
