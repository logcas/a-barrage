import BaseFixedCommander from './base-fixed';
import { CommanderConfig } from '../../types';
export default class FixedTopCommander extends BaseFixedCommander {
    constructor(canvas: HTMLCanvasElement, config: CommanderConfig);
    render(): void;
}
