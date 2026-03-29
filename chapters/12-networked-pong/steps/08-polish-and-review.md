# Polish and Review

The networked Pong game works. Let's add a few finishing touches and take stock of what you've built.

## Countdown before serve

In the client, when the state phase is `'scored'` and `servePause` is active, show a countdown:

```js
  if (gameState.phase === 'scored' && gameState.servePause > 0) {
    const seconds = Math.ceil(gameState.servePause / 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(seconds), canvas.width / 2, canvas.height / 2);
  }
```

A visible countdown (3, 2, 1) before the ball launches. Both players see the same number because it comes from the server state.

## Latency display

It's useful to see how long messages take to travel. Add a ping system.

In the client, send a ping periodically:

```js
setInterval(() => {
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify({ type: 'ping', time: Date.now() }));
  }
}, 2000);
```

In the server, respond immediately:

```js
      if (message.type === 'ping') {
        socket.send(JSON.stringify({ type: 'pong', time: message.time }));
      }
```

In the client, measure the round trip:

```js
    if (message.type === 'pong') {
      const latency = Date.now() - message.time;
      console.log('ping', `${latency}ms`);
    }
```

The watch panel shows the round-trip time in milliseconds. On `localhost` it's 0-1ms. On a local network, 2-20ms. This number directly affects how responsive the game feels.

## Player indicator

Show which player you are. In the client's render loop, after drawing the paddles:

```js
  if (myPlayer >= 0) {
    ctx.fillStyle = 'rgba(100,180,255,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = myPlayer === 0 ? 'left' : 'right';
    const x = myPlayer === 0 ? 24 : canvas.width - 24;
    ctx.fillText('YOU', x, canvas.height - 10);
  }
```

A subtle "YOU" label near your paddle so you always know which side you're on.

## What you built

Over two chapters, you took a local two-player game and split it across a network:

- **Authoritative server** — the server runs the game. Clients send input and receive state. The server is the single source of truth.
- **Input abstraction** — the client sends intent (`'up'`, `'down'`), not raw key codes. The server applies input to the correct player.
- **Full state broadcast** — every frame, the complete game state is sent to all clients. Simple, correct, no sync issues.
- **Interpolation (lerp)** — the client smooths between server updates for fluid visuals despite network jitter.
- **Connection management** — player assignment, slot filling, auto-reconnect, game pause on disconnect.
- **Sound from server events** — the server tells the client *what happened*, the client makes it audible.
- **Latency measurement** — ping/pong messages to measure round-trip time.

## Client-side prediction

In production games, the client doesn't wait for the server to confirm every action. When you press "up," the client *immediately* moves your paddle — it predicts what the server will do. When the server's state arrives, the client compares its prediction to the server's truth and corrects any difference.

This is called **client-side prediction with server reconciliation**. It makes the game feel instant even over a 100ms connection. It's also significantly more complex — the client needs to replay inputs, handle rollbacks, and interpolate between predicted and authoritative state.

We're not implementing it here. The simple model (send input, wait for state) is correct, understandable, and works well on a local network. If you pursue game networking further, client-side prediction is the next concept to study.

## What's next

The patterns you used here — authoritative server, input messages, state broadcast, interpolation — are exactly what Starfighter multiplayer needs. The difference is scale: Pong has 3 entities. Starfighter has dozens. The protocol is the same. The state object is bigger. The next chapter applies everything you've learned here to the real game.
