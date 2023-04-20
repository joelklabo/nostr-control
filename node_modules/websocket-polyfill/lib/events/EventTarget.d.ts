import { Event } from "./Event";
export declare class EventTarget<Types extends object = {}> {
    /**
     * @hidden
     */
    private listeners_;
    /**
     * @hidden
     */
    private created_at_;
    constructor();
    dispatchEvent(event: Event): void;
    addEventListener<K extends keyof Types>(type: K, listener: Types[K]): void;
    removeEventListener<K extends keyof Types>(type: string, listener: Types[K]): void;
}
//# sourceMappingURL=EventTarget.d.ts.map