# Handling Disconnects

One player closes their tab. What happens?

Right now, the server detects the disconnect, sets `state.phase = 'waiting'`, and clears the player slot. The other client sees "Waiting for Player 2..." — but there's no way for a new player to fill the slot without restarting the server.

The server already handles this correctly — when a new connection comes in, it's assigned to the first open slot. But let's make the experience smoother on the client side.

## Client reconnection

When the socket closes, the client currently shows the connection overlay. Update the close handler to auto-reconnect after a delay:

```js
  socket.addEventListener('close', () => {
    console.log('status', 'Disconnected');
    gameState = null;

    setTimeout(() => {
      console.log('status', 'Reconnecting...');
      connectToServer(address);
    }, 2000);
  });
```

This reuses the same `address` the player entered initially. After 2 seconds, it tries again. If the server is still running, the player reconnects and is reassigned to their slot.

But there's a problem: `address` is a local variable inside the `keydown` handler. Move it to a module-level variable so the reconnect can use it:

```js
let serverAddress = '';
```

In the `keydown` handler:

```js
    serverAddress = serverInput.value.trim();
    if (serverAddress === '') return;
    connectToServer(serverAddress);
```

In `connectToServer`, use `serverAddress` for reconnection:

```js
  socket.addEventListener('close', () => {
    console.log('status', 'Disconnected');
    gameState = null;

    setTimeout(() => {
      console.log('status', 'Reconnecting...');
      connectToServer(serverAddress);
    }, 2000);
  });
```

## Server: reset on reconnect

When both players reconnect after a disconnect, the game should restart. The server already resets `state.phase = 'waiting'` on disconnect. Update the connection handler to also reset scores when a new game begins:

In `server.js`, when both players are connected:

```js
  if (players[0] && players[1] && state.phase === 'waiting') {
    state.scores = [0, 0];
    state.winner = -1;
    state.phase = 'scored';
    resetBall(1);
    console.log('Game starting');
  }
```

## Test it

1. Start the server. Connect two players. Start playing.
2. Close one tab. The other shows "Waiting for Player 2..."
3. Open a new tab and connect. The game restarts with 0-0.
4. Stop the server (`Ctrl+C`). Both clients show "Reconnecting..." in the watch panel.
5. Start the server again. Both clients reconnect within 2 seconds.

The experience is seamless — no manual reload needed.
