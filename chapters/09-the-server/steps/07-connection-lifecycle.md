# Connection Lifecycle

Connections aren't permanent. Clients disconnect — they close the tab, their internet drops, the app crashes. A robust server handles all of these gracefully.

## Track connected users

Right now the server stores each client's name in a local `let name` variable inside the connection handler. That works, but we can't list who's connected or send targeted messages. Let's track clients properly.

Update `server.js`:

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4000 });
const clients = new Map();

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
  for (const [socket, info] of clients) {
    names.push(info.name);
  }
  broadcast({ type: 'users', names: names });
}

wss.on('connection', (socket) => {
  clients.set(socket, { name: 'Anonymous' });

  socket.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch (err) {
      return;
    }

    const info = clients.get(socket);

    if (message.type === 'join') {
      info.name = message.name || 'Anonymous';
      console.log(info.name + ' joined');
      broadcast({ type: 'system', text: info.name + ' joined' });
      broadcastUserList();
    }

    if (message.type === 'chat') {
      console.log(info.name + ': ' + message.text);
      broadcast({ type: 'chat', name: info.name, text: message.text });
    }
  });

  socket.on('close', () => {
    const info = clients.get(socket);
    const name = info ? info.name : 'Unknown';
    clients.delete(socket);
    console.log(name + ' left');
    broadcast({ type: 'system', text: name + ' left' });
    broadcastUserList();
  });

  socket.on('error', (err) => {
    console.log('Socket error: ' + err.message);
  });
});

console.log('WebSocket server running on ws://localhost:4000');
```

## What's new

**`Map`** — a data structure you haven't used before. It's like a plain object (`{}`), but the keys can be anything — including WebSocket objects. `clients.set(socket, info)` stores data for a specific connection. `clients.get(socket)` retrieves it. `clients.delete(socket)` removes it.

A `Map` is better than a plain object here because WebSocket objects aren't strings — they're complex objects, and `Map` handles non-string keys correctly.

**`broadcastUserList()`** — sends the current list of connected names to every client whenever someone joins or leaves. The client will use this to show who's online.

**`socket.on('error')`** — handles connection errors (dropped connections, network issues). Without this handler, an error would print an ugly stack trace. With it, we log a clean message and move on.

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
