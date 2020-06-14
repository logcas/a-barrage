import { BarrageConfig, RawBarrageObject, CommanderMap, CommanderMapKey, ScrollBarrageObject, FixedBarrageObejct } from './types';
import EventEmitter from './event-emitter';
import BaseCommander from './commander/base';
declare type BarrageConfigInit = Partial<BarrageConfig>;
export default class BarrageMaker extends EventEmitter {
    el: HTMLDivElement | HTMLCanvasElement;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    config: BarrageConfig;
    commanderMap: CommanderMap;
    animation: number | null;
    constructor(el: HTMLDivElement | HTMLCanvasElement | string, config?: BarrageConfigInit);
    resize(width?: number): void;
    clear(): void;
    setOpacity(opacity?: number): void;
    setFontSize(zoom?: number): void;
    add(barrage: RawBarrageObject, type?: CommanderMapKey): void;
    start(): void;
    stop(): void;
    _forEachManager(handler: (commander: BaseCommander<ScrollBarrageObject> | BaseCommander<FixedBarrageObejct>) => any): void;
    _render(): void;
}
export {};
