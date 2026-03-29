# Receiving State

Every frame, the server broadcasts the full game state:

```js
broadcast({ type: 'state', state: state });
```

The client receives it and stores it in `gameState`. The render loop draws from `gameState` — ball position, paddle positions, scores, phase. No local physics, no local collision detection.

## What's in the state

```json
{
  "ball": { "x": 412, "y": 287, "vx": 4.2, "vy": -1.8, "size": 8 },
  "paddles": [
    { "y": 230, "height": 80 },
    { "y": 195, "height": 80 }
  ],
  "scores": [2, 1],
  "phase": "playing",
  "servePause": 0,
  "winner": -1
}
```

Everything the client needs to draw the game is in this object. The client doesn't need `vx` or `vy` (those are for the server's physics), but they come along for free and do no harm.

## Full state vs deltas

We're sending the *entire* state every frame. That's 200-300 bytes, 60 times per second — about 18 KB/s per client. For Pong, this is fine. For a game with thousands of entities, you'd send only what changed (**deltas**). But deltas add complexity: the client has to track what it received before and merge changes correctly. Full state is simpler and correct by default — every frame is a complete picture, so there's nothing to get out of sync.

## Adding sound triggers

The client currently has no sound — it can't tell when a paddle hit or a score happened because it's just receiving positions. Let's add event flags to the state.

In `server.js`, add an events array that's populated during the tick and cleared after broadcast:

```js
state.events = [];
```

In `checkPaddleHit`, after reversing the ball:

```js
    state.events.push('hit');
```

In the top/bottom bounce:

```js
    state.events.push('wall');
```

In both scoring blocks:

```js
    state.events.push('score');
```

In the broadcast interval, clear events after sending:

```js
setInterval(() => {
  tick();
  broadcast({ type: 'state', state: state });
  state.events = [];
}, 1000 / 60);
```

In the client's message handler, after `gameState = message.state`:

```js
    if (message.type === 'state') {
      gameState = message.state;
      if (gameState.events) {
        for (const event of gameState.events) {
          if (event === 'hit') { playHit(); }
          if (event === 'wall') { playWall(); }
          if (event === 'score') { playScore(); }
        }
      }
    }
```

Save and restart the server. Now both clients hear paddle hits, wall bounces, and score sounds — triggered by the server's authoritative game events, not local guesses.

## Try it

- Play from two browser windows. Confirm that both see the same ball position and hear the same sounds at the same time.
- Watch the server terminal — it logs player connections and game start.
