# Connection Lifecycle

Connections aren't permanent. Clients disconnect — they close the tab, their internet drops, the app crashes. A robust server handles all of these gracefully.

## Track connected users

Right now the server stores each client's name in a local `let name` variable inside the connection handler. That works, but we can't list who's connected or send targeted messages. Let's track clients properly.

We'll give each connection a unique ID and store its info in a plain object. Update `server.js`:

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });
const clients = {};
let nextId = 1;

function broadcast(message) {
  const json = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(json);
    }
  }
}

function broadcastUserList() {
  const names = [];
  for (const id in clients) {
    names.push(clients[id].name);
  }
  broadcast({ type: 'users', names: names });
}

wss.on('connection', (socket) => {
  const id = nextId;
  nextId = nextId + 1;
  clients[id] = { name: 'Anonymous', socket: socket };

  socket.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch (err) {
      return;
    }

    const info = clients[id];

    if (message.type === 'join') {
      info.name = message.name || 'Anonymous';
      console.log(`${info.name} joined (id: ${id})`);
      broadcast({ type: 'system', text: `${info.name} joined` });
      broadcastUserList();
    }

    if (message.type === 'chat') {
      console.log(`${info.name}: ${message.text}`);
      broadcast({ type: 'chat', name: info.name, text: message.text });
    }
  });

  socket.on('close', () => {
    const name = clients[id] ? clients[id].name : 'Unknown';
    delete clients[id];
    console.log(`${name} left (id: ${id})`);
    broadcast({ type: 'system', text: `${name} left` });
    broadcastUserList();
  });

  socket.on('error', (err) => {
    console.log(`Socket error: ${err.message}`);
  });
});

console.log('WebSocket server running on ws://localhost:4000');
```

## What's new

**A `clients` object keyed by ID.** Each connection gets a unique numeric ID from `nextId`. The client's info is stored at `clients[id]` — its name and socket reference. When a client disconnects, `delete clients[id]` removes it.

This is the same kind of object you've used since Chapter 1 — plain `{}` with string/number keys. Each key is a connection ID, each value is an object with `name` and `socket` properties.

**`broadcastUserList()`** — loops through `clients` with `for...in`, collects all names, and broadcasts them. Every client gets the updated list whenever someone joins or leaves.

**`socket.on('error')`** — handles connection errors (dropped connections, network issues). Without this handler, an error would print an ugly stack trace. With it, we log a clean message and move on.

**Template literals** — notice the backtick strings: `` `${info.name} joined` ``. Same syntax from Chapter 7.

## Update the client

Add a handler for the `users` message type in `src/client.js`:

```js
  if (message.type === 'users') {
    console.log('online', message.names.join(', '));
  }
```

Save and restart the server. Connect from the app. The watch panel shows `online = Player`. Open a second tab — it shows `online = Player, Player`. Close the tab — it updates back to `online = Player`.

## The lifecycle

A connection goes through four stages:

1. **Connect** — `new WebSocket(...)` on the client, `'connection'` event on the server
2. **Identify** — client sends a `join` message, server stores the name
3. **Communicate** — both sides send messages freely
4. **Disconnect** — `'close'` event on both sides, server cleans up

Every real-time application — chat, games, collaborative editing — follows this lifecycle. The details change, but the stages don't. In the next chapter, we'll build a proper chat interface on top of this server.
