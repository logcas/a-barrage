import BaseCssCommander from './base-css';
import { CommanderConfig, FixedBarrageObejct } from '../../types';
import Track from '../../track';
export default abstract class BaseFixedCssCommander extends BaseCssCommander<FixedBarrageObejct> {
    objToElm: WeakMap<FixedBarrageObejct, HTMLElement>;
    constructor(el: HTMLDivElement, config: CommanderConfig);
    add(barrage: FixedBarrageObejct): boolean;
    _findTrack(): number;
    _extractBarrage(): void;
    _removeTopElementFromTrack(track: Track<FixedBarrageObejct>): void;
}
