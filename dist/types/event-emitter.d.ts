interface EventHandler {
    (...args: any[]): any;
}
export default class EventEmitter {
    private _eventsMap;
    $on(eventName: string, handler: EventHandler): this;
    $once(eventName: string, handler: EventHandler): this;
    $off(eventName: string, handler?: EventHandler): this;
    $emit(eventName: string, ...args: any[]): void;
}
export {};
