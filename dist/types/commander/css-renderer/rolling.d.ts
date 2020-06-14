import BaseCssCommander from './base-css';
import { ScrollBarrageObject, CommanderConfig } from '../../types';
import Track from '../../track';
export default class RollingCssCommander extends BaseCssCommander<ScrollBarrageObject> {
    constructor(el: HTMLDivElement, config: CommanderConfig);
    private get _defaultSpeed();
    private get _randomSpeed();
    add(barrage: ScrollBarrageObject): boolean;
    _findTrack(): number;
    _extractBarrage(): void;
    render(): void;
    _removeElementFromTrack(track: Track<ScrollBarrageObject>, removedIndex: number): void;
}
