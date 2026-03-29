# Structured Messages

Right now messages are plain strings. That works for "hello," but a real chat needs more: who sent it, when, what kind of message it is. We need structure — and we already have the tool: **JSON**.

## A message protocol

Let's define a simple format. Every message is a JSON object with a `type` field that says what kind of message it is:

```json
{ "type": "chat", "text": "hello everyone" }
{ "type": "join", "name": "Wolfie" }
```

The `type` field lets the server (and client) decide how to handle each message without guessing from the content.

## Update the server

Replace `server.js`:

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });

function broadcast(message) {
  const json = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(json);
    }
  }
}

wss.on('connection', (socket) => {
  let name = 'Anonymous';

  socket.on('message', (data) => {
    const text = data.toString();
    let message;

    try {
      message = JSON.parse(text);
    } catch (err) {
      console.log('Invalid JSON: ' + text);
      return;
    }

    console.log(name + ':', message);

    if (message.type === 'join') {
      name = message.name || 'Anonymous';
      broadcast({ type: 'system', text: name + ' joined' });
    }

    if (message.type === 'chat') {
      broadcast({ type: 'chat', name: name, text: message.text });
    }
  });

  socket.on('close', () => {
    broadcast({ type: 'system', text: name + ' left' });
  });
});

console.log('WebSocket server running on ws://localhost:4000');
```

## What's new

**`broadcast(message)`** — a helper that stringifies a message object and sends it to every client. The server always sends JSON, and clients always receive JSON.

**`try/catch`** — this is new. `JSON.parse` throws an error if the input isn't valid JSON. Without `try/catch`, that error would crash the server. `try` runs the risky code. If it throws, `catch` runs instead — and the server keeps going. This is **error handling**: acknowledging that things can go wrong and deciding what to do about it.

**Message types** — the server checks `message.type` and handles each one differently:
- `'join'` — stores the client's name and tells everyone they joined
- `'chat'` — broadcasts the message with the sender's name attached

The server *adds* the `name` to chat messages. The client doesn't get to choose how their name appears — the server is the authority. This matters for multiplayer games too: the server decides what's true.

## Update the client

Replace `src/client.js`:

```js
const socket = new WebSocket('ws://localhost:4000');

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'join', name: 'Player' }));
  console.log('status', 'Connected');
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'chat') {
    console.log(message.name, message.text);
  }

  if (message.type === 'system') {
    console.log('system', message.text);
  }
});

socket.addEventListener('close', () => {
  console.log('status', 'Disconnected');
});
```

Save and restart the server. The watch panel shows `status = Connected`, then `system = Player joined`. Open a second browser tab to the same URL — you'll see `system = Player joined` again in both.

## The protocol pattern

What you've built is a **protocol** — an agreement between client and server about the format and meaning of messages. The client sends JSON with a `type`. The server reads the `type`, does the right thing, and sends JSON back with a `type`. Both sides know what to expect.

Every networked application has a protocol. HTTP has methods and status codes. WebSockets have whatever you define. The game multiplayer system you'll build later uses the same pattern — different `type` values for different game events.

## Try it

- Send a chat message from the DevTools console: `socket.send(JSON.stringify({ type: 'chat', text: 'hello!' }))`. Both clients should see it in the watch panel.
- Send garbage: `socket.send('not json')`. The server logs "Invalid JSON" but doesn't crash.
