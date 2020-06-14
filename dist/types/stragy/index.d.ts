import { RawBarrageObject, CommanderMapKey } from '../types';
export interface FnMap {
    clear(): void;
    add(barrage: RawBarrageObject, type: CommanderMapKey): void;
    _render(): void;
}
declare type FnMapKey = keyof FnMap;
export declare function getHandler(engine: 'canvas' | 'css3', fn: FnMapKey): (() => void) | ((barrage: RawBarrageObject, type: "scroll" | "fixed-top" | "fixed-bottom") => void) | (() => void);
export {};
