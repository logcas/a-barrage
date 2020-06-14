import BaseCanvasCommander from './base-canvas';
import { ScrollBarrageObject, CommanderConfig } from '../../types';
export default class RollingCommander extends BaseCanvasCommander<ScrollBarrageObject> {
    constructor(canvas: HTMLCanvasElement, config: CommanderConfig);
    private get _defaultSpeed();
    private get _randomSpeed();
    add(barrage: ScrollBarrageObject): boolean;
    _findTrack(): number;
    _extractBarrage(): void;
    render(): void;
}
