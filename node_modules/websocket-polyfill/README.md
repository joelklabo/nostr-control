# WebSocket-Polyfill
## Outline
WebSocket class for NodeJS.

## Installation
### NPM Module
```bash
npm install --save websocket-polyfill
```

### Usage
```typescript
import "websocket-polyfill";

function main(): void
{
    let ws: WebSocket = new WebSocket("ws://127.0.0.1:38000/main");
    ws.onmessage = (msg: MessageEvent) =>
    {
        console.log("Data from ws-server", msg.data);
    };
}
main();
```