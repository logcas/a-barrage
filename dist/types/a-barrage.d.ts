import { BarrageConfig, RawBarrageObject, TrackManagerMap, TrackManagerMapKey, ScrollBarrageObject, FixedBarrageObejct } from './types';
import TrackManager from './track-manager';
import EventEmitter from './event-emitter';
declare type BarrageConfigInit = Partial<BarrageConfig>;
export default class BarrageMaker extends EventEmitter {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    config: BarrageConfig;
    trackManagerMap: TrackManagerMap;
    animation: number | null;
    constructor(el: HTMLElement | string, config?: BarrageConfigInit);
    resize(width?: number): void;
    clear(): void;
    setOpacity(opacity?: number): void;
    setFontSize(zoom?: number): void;
    add(barrage: RawBarrageObject, type?: TrackManagerMapKey): void;
    start(): void;
    stop(): void;
    _forEachManager(handler: (trackManager: TrackManager<ScrollBarrageObject> | TrackManager<FixedBarrageObejct>) => any): void;
    _render(): void;
    _bindNativeEvents(): void;
    _delegateEvents(): void;
}
export {};
