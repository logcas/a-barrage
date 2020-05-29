import { BarrageObject } from './types';
interface TrackForEachHandler<T extends BarrageObject> {
    (track: T, index: number, array: T[]): void;
}
export default class BarrageTrack<T extends BarrageObject> {
    barrages: T[];
    offset: number;
    forEach(handler: TrackForEachHandler<T>): void;
    reset(): void;
    push(...items: T[]): void;
    removeTop(): void;
    updateOffset(): void;
}
export {};
