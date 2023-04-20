import { EventTarget } from "./events/EventTarget";
export declare class WebSocket extends EventTarget<WebSocketEventMap> {
    /**
     * @hidden
     */
    private client_;
    /**
     * @hidden
     */
    private connection_;
    /**
     * @hidden
     */
    private on_;
    /**
     * @hidden
     */
    private state_;
    constructor(url: string, protocols?: string | string[]);
    close(code?: number, reason?: string): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    readonly url: string;
    readonly protocol: string;
    readonly extensions: string;
    readonly readyState: number;
    readonly bufferedAmount: number;
    readonly binaryType: string;
    onopen: Listener<"open">;
    onclose: Listener<"close">;
    onmessage: Listener<"message">;
    onerror: Listener<"error">;
    /**
     * @hidden
     */
    private _Set_on;
    /**
     * @hidden
     */
    private _Handle_connect;
    /**
     * @hidden
     */
    private _Handle_close;
    /**
     * @hidden
     */
    private _Handle_message;
    /**
     * @hidden
     */
    private _Handle_error;
}
export declare namespace WebSocket {
    const CONNECTING = 0;
    const OPEN = 1;
    const CLOSING = 2;
    const CLOSED = 3;
}
declare type Listener<K extends keyof WebSocketEventMap> = (event: WebSocketEventMap[K]) => void;
export {};
//# sourceMappingURL=WebSocket.d.ts.map