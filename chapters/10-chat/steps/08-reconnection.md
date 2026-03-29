# Reconnection

Stop the server (`Ctrl+C` in the terminal). The chat disconnects. Start it again — the chat stays disconnected. The user has to reload the page manually.

A real chat client reconnects automatically. Let's add that.

## The reconnect loop

Replace the `connectToServer` function with a version that retries on disconnect:

```js
function connectToServer() {
  socket = new WebSocket('ws://localhost:4000');

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'join', name: myName }));
    console.log('status', 'Connected as ' + myName);
    addSystemMessage('Connected');
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'chat') {
      addMessage(message.name, message.text, message.name === myName);
    }
    if (message.type === 'system') {
      addSystemMessage(message.text);
    }
    if (message.type === 'users') {
      updateUserList(message.names);
      console.log('online', message.names.join(', '));
    }
  });

  socket.addEventListener('close', () => {
    console.log('status', 'Reconnecting...');
    addSystemMessage('Disconnected. Reconnecting...');
    userList.innerHTML = '';

    setTimeout(() => {
      connectToServer();
    }, 2000);
  });
}
```

When the connection closes, instead of giving up, the client waits 2 seconds and calls `connectToServer()` again. The new connection triggers `'open'`, which re-sends the `join` message with the stored `myName` — the server sees it as a new client, broadcasts the updated user list, and the chat resumes.

## What `setTimeout` does

```js
setTimeout(() => {
  connectToServer();
}, 2000);
```

`setTimeout(callback, ms)` schedules a function to run after a delay. `2000` is 2000 milliseconds — 2 seconds. This is another higher-order function: you pass a function, and `setTimeout` calls it later.

The 2-second delay prevents a rapid reconnect loop if the server is down. Without it, the client would try to reconnect instantly, fail, disconnect, and try again — hundreds of times per second.

## Test it

1. Start the server, connect from the chat, send a message.
2. Stop the server (`Ctrl+C`). The chat shows "Disconnected. Reconnecting..."
3. Start the server again. Within 2 seconds, the chat reconnects — "Connected" and "Player joined" appear. Your name shows up in the sidebar again.

The user never has to reload the page. The reconnection is invisible once the server comes back.

## What you built

Over the last two chapters, you've built a real-time chat application from scratch:

- A **WebSocket server** in Node.js that tracks clients, broadcasts messages, and handles disconnections
- A **structured protocol** with JSON message types
- An **HTML interface** with an input bar, message display, username prompt, user list, and timestamps
- **DOM manipulation** — creating and appending elements from JavaScript
- **CSS classes** — separating styling from logic
- **Error handling** with `try/catch` for malformed JSON
- **Auto-reconnection** for network resilience
- **async/await** for managing connections

Every one of these concepts extends beyond chat. The server pattern is the same one behind multiplayer games, live dashboards, and collaborative editors. The DOM skills apply to every website. The protocol pattern applies to every networked application.

In the next chapter, we'll take this same WebSocket infrastructure and plug it into the game — two ships, one screen, controlled by two players over the network.
