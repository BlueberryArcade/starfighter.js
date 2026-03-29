# Broadcast

The echo server sends messages back to the same client that sent them. That's useful for testing, but useless for chat — the whole point is that *other* people see your messages.

## Sending to everyone

Update `server.js`. Instead of echoing back to the sender, broadcast to all connected clients:

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', (socket) => {
  console.log('Client connected (' + wss.clients.size + ' total)');

  socket.on('message', (data) => {
    const text = data.toString();
    console.log('Received: ' + text);

    // Send to every connected client.
    for (const client of wss.clients) {
      if (client.readyState === 1) {
        client.send(text);
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected (' + wss.clients.size + ' total)');
  });
});

console.log('WebSocket server running on ws://localhost:4000');
```

`wss.clients` is a Set of all currently connected sockets. When a message arrives, we loop through every client and send the message to each one. The `readyState === 1` check ensures we only send to clients whose connection is fully open.

Restart the server (`Ctrl+C`, then `node projects/chat/server.js`).

## Test with the client

The right panel reconnects automatically (browser-sync reloads the page when you save). Update `src/client.js` so you can send messages interactively:

```js
const socket = new WebSocket('ws://localhost:4000');

socket.addEventListener('open', () => {
  console.log('Connected to server');
});

socket.addEventListener('message', (event) => {
  console.log('message', event.data);
});

socket.addEventListener('close', () => {
  console.log('Disconnected');
});

// Expose send globally so we can use it from the console for testing.
window.sendMessage = (text) => {
  socket.send(text);
};
```

Save. Open DevTools on the right panel (`Cmd+Alt+I`), go to the Console tab, and type:

```
sendMessage('hello from the app')
```

The watch panel shows `message = hello from the app`. The message went from the client to the server and back to every connected client — including the sender.

## A second client

To prove broadcast works, open a regular browser window and navigate to `http://localhost:3001` (the browser-sync URL for the right panel). Now you have two clients connected: the Electron right panel and the browser window.

Send a message from either one. Both receive it. The server terminal shows two connections.

This is the core of real-time communication. One client sends a message, the server pushes it to everyone. In the next steps we'll add structure to these messages and build them into a proper chat.

## Try it

- Open three browser tabs all connected to the same server. Send from one, watch all three receive it.
- Check `wss.clients.size` — the server logs the count on each connect/disconnect.
