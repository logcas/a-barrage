import BaseFixedCommander from './base-fixed';
import { CommanderConfig } from '../../types';
export default class FixedTopCommander extends BaseFixedCommander {
    constructor(el: HTMLDivElement, config: CommanderConfig);
    render(): void;
}
