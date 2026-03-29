# Interpolation

Play the game and watch the paddles carefully. They don't glide — they jump between positions in small steps. The server sends state 60 times per second, but network timing isn't perfectly even. Some updates arrive a few milliseconds late, causing visible stuttering.

The fix: instead of snapping to the server's position, **smoothly move toward it**.

## Lerp

The technique is called **interpolation**, or **lerp** (linear interpolation). The formula:

```js
current = current + (target - current) * t;
```

`current` is where the object is on screen. `target` is where the server says it should be. `t` is a blending factor between 0 and 1 — how quickly to catch up. `0.3` means "move 30% of the remaining distance each frame."

At `t = 1`, the object snaps to the target (no smoothing). At `t = 0.1`, it glides slowly. `0.3` is a good balance for Pong — responsive but smooth.

## Apply to paddles and ball

In the client's render loop, instead of drawing directly from `gameState` positions, maintain local positions that lerp toward the server values.

Add state at the top of `main.js`:

```js
const display = {
  ball: { x: 400, y: 300 },
  paddles: [{ y: 260 }, { y: 260 }]
};
```

In `loop()`, before drawing, lerp toward the server state:

```js
  if (gameState) {
    const t = 0.3;
    display.ball.x = display.ball.x + (gameState.ball.x - display.ball.x) * t;
    display.ball.y = display.ball.y + (gameState.ball.y - display.ball.y) * t;
    display.paddles[0].y = display.paddles[0].y + (gameState.paddles[0].y - display.paddles[0].y) * t;
    display.paddles[1].y = display.paddles[1].y + (gameState.paddles[1].y - display.paddles[1].y) * t;
  }
```

Update the drawing code to use `display` instead of `gameState` for positions:

```js
  // Ball
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(display.ball.x - gameState.ball.size / 2, display.ball.y - gameState.ball.size / 2, gameState.ball.size, gameState.ball.size);

  // Paddles
  ctx.fillRect(20, display.paddles[0].y, 12, gameState.paddles[0].height);
  ctx.fillRect(canvas.width - 32, display.paddles[1].y, 12, gameState.paddles[1].height);
```

Save and play. The difference is subtle but clear — paddles glide instead of jumping. The ball moves smoothly even if a server update arrives a few milliseconds late.

## When to snap

Lerp works for continuous movement. But when the ball resets after a score, it should **snap** to the centre, not float there slowly. In the message handler, reset the display position when a score happens:

```js
      if (gameState.events) {
        for (const event of gameState.events) {
          if (event === 'score') {
            display.ball.x = gameState.ball.x;
            display.ball.y = gameState.ball.y;
            playScore();
          }
          if (event === 'hit') { playHit(); }
          if (event === 'wall') { playWall(); }
        }
      }
```

## Try it

- Change `t` to `0.05` — everything feels sluggish and laggy.
- Change `t` to `1.0` — back to snapping, no smoothing.
- Change `t` to `0.5` — snappy but smooth. Find the value that feels right.
