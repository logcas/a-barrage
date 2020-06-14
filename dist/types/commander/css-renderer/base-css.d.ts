import BaseCommander from '../base';
import { BarrageObject, CommanderConfig } from '../../types';
export default abstract class BaseCssCommander<T extends BarrageObject> extends BaseCommander<T> {
    el: HTMLDivElement;
    objToElm: WeakMap<T, HTMLElement>;
    elmToObj: WeakMap<HTMLElement, T>;
    freezeBarrage: T | null;
    constructor(el: HTMLDivElement, config: CommanderConfig);
    removeElement(target: HTMLElement): void;
    _mouseMoveEventHandler(e: Event): void;
    _mouseClickEventHandler(e: Event): void;
    reset(): void;
}
