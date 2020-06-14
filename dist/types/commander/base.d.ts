import { BarrageObject, CommanderConfig } from '../types';
import Track from '../track';
interface CommanderForEachHandler<T extends BarrageObject> {
    (track: Track<T>, index: number, array: Track<T>[]): void;
}
export default abstract class BaseCommander<T extends BarrageObject> {
    protected trackWidth: number;
    protected trackHeight: number;
    protected duration: number;
    protected tracks: Track<T>[];
    waitingQueue: T[];
    constructor(config: CommanderConfig);
    forEach(handler: CommanderForEachHandler<T>): void;
    reset(): void;
    resize(width?: number, height?: number): void;
    abstract add(barrage: T): boolean;
    abstract _findTrack(): number;
    abstract _extractBarrage(): void;
    abstract render(): void;
}
export {};