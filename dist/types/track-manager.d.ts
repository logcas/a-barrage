import Track from './track';
import { BarrageObject } from './types';
interface TrackManagerForEachHandler<T extends BarrageObject> {
    (track: Track<T>, index: number, array: Track<T>[]): void;
}
declare type BarrageType = 'scroll' | 'fixed-top' | 'fixed-bottom';
interface TrackManagerConfig {
    trackWidth: number;
    trackHeight: number;
    duration: number;
    numbersOfTrack: number;
    type: BarrageType;
}
export default class TrackManager<T extends BarrageObject> {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    trackWidth: number;
    trackHeight: number;
    tracks: Track<T>[];
    duration: number;
    type: BarrageType;
    waitingQueue: T[];
    constructor(canvas: HTMLCanvasElement, config: TrackManagerConfig);
    forEach(handler: TrackManagerForEachHandler<T>): void;
    add(barrage: T): any;
    _findMatchestTrack(): number;
    _pushBarrage(): any;
    render(): void;
    get _defaultSpeed(): number;
    get _randomSpeed(): number;
    reset(): void;
    resize(trackWidth?: number, trackHeight?: number): void;
}
export {};
