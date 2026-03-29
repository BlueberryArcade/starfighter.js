# WebSockets

HTTP is a one-shot conversation: the client asks, the server answers, and the connection closes. For real-time communication — chat, multiplayer games, live updates — both sides need to send messages whenever they want, without waiting for the other to ask.

**WebSockets** solve this. A WebSocket is a connection that stays open. Once established, either side can send a message at any time. The server can push data to the client without being asked. The client can send data to the server whenever it wants. Both sides are equal.

## An echo server

Replace `server.js` with a WebSocket server. The `ws` library is already installed in this project:

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (data) => {
    const text = data.toString();
    console.log('Received: ' + text);
    socket.send('Echo: ' + text);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:4000');
```

Run it: `node projects/chat/server.js`

The server starts and waits. Unlike the HTTP server, it doesn't respond to browser page loads — it waits for WebSocket connections specifically.

## The client

Open `src/client.js` and replace it with:

```js
const socket = new WebSocket('ws://localhost:4000');

socket.addEventListener('open', () => {
  console.log('Connected to server');
  socket.send('ping');
});

socket.addEventListener('message', (event) => {
  console.log('Server says: ' + event.data);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from server');
});
```

Save. Look at the console panel in the right panel:

```
Connected to server
Server says: Echo: ping
```

And in the terminal where the server is running:

```
Client connected
Received: ping
```

Two programs, talking in real time. The client sent "ping," the server received it and sent back "Echo: ping," and the client received the echo.

## How it works

`new WebSocket('ws://localhost:4000')` opens a connection to the server. Once open, both sides can call `.send()` at any time. Messages arrive as `'message'` events.

The flow:

1. Client calls `new WebSocket(...)` → server fires `'connection'` event
2. Client calls `socket.send('ping')` → server fires `'message'` event with `'ping'`
3. Server calls `socket.send('Echo: ping')` → client fires `'message'` event with `'Echo: ping'`

No requesting. No polling. Just direct, bidirectional messages.

## Event-driven

Notice that both the client and server use `addEventListener` (client) or `.on()` (server) — the same event-driven pattern you've used since Chapter 1 with `keydown` and `mousedown`. A WebSocket connection fires events when things happen: `open`, `message`, `close`. You register handlers, and they run when the event occurs.

This is **asynchronous** — your code doesn't wait for a message. It registers a handler and continues. When a message eventually arrives, the handler fires. This is fundamentally different from the game loop, which runs synchronously 60 times per second.

## Try it

- Change `socket.send('ping')` to `socket.send('hello world')`. Check both the console panel and the terminal.
- Send a second message after the first: `socket.send('second message')`. Both arrive separately.
- Stop the server (`Ctrl+C`) and watch the client's console — it logs "Disconnected."
