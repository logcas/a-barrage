import BaseCssCommander from './base-css';
import { ScrollBarrageObject, CommanderConfig } from '../../types';
import Track from '../../track';
export default class RollingCssCommander extends BaseCssCommander<ScrollBarrageObject> {
    objToElm: WeakMap<ScrollBarrageObject, HTMLElement>;
    constructor(el: HTMLDivElement, config: CommanderConfig);
    private get _defaultSpeed();
    private get _randomSpeed();
    add(barrage: ScrollBarrageObject): boolean;
    _findTrack(): number;
    _extractBarrage(): void;
    render(): void;
    _removeTopElementFromTrack(track: Track<ScrollBarrageObject>): void;
}
