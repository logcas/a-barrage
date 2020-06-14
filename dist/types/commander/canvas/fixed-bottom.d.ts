import BaseFixedCommander from './base-fixed';
import { CommanderConfig } from '../../types';
export default class FixedBottomCommander extends BaseFixedCommander {
    constructor(canvas: HTMLCanvasElement, config: CommanderConfig);
    render(): void;
}
