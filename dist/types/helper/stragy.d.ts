import { BarrageObject } from '../types';
import TrackManager from '../track-manager';
export declare const addBarrageStragy: {
    [x: string]: (this: TrackManager, barrage: BarrageObject) => boolean;
};
export declare const findTrackStragy: {
    [x: string]: (this: TrackManager) => number;
};
export declare const pushBarrageStragy: {
    [x: string]: (this: TrackManager) => void;
};
export declare const renderBarrageStragy: {
    [x: string]: (this: TrackManager) => void;
};
