# Speed and Timing

The game works, but it doesn't *feel* right yet. Two small changes make a big difference.

## Speed up on each hit

The ball starts at a constant speed. Real Pong accelerates — each hit makes the ball slightly faster, raising the tension.

In `checkPaddleCollision`, after reversing `ball.vx`:

```js
    // Speed up slightly.
    ball.vx = ball.vx * 1.05;
```

Multiplying by `1.05` increases the speed by 5% each hit. After 10 hits, the ball is ~63% faster than it started. After 20, it's more than double. The game naturally escalates.

Make sure `resetBall` resets to the base speed, not the accelerated speed:

```js
function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 4 * direction;
  ball.vy = (Math.random() - 0.5) * 4;
}
```

## Serve pause

When someone scores, the ball instantly launches. That's disorienting — the player barely registers the point before they're playing again. Add a brief pause.

```js
let servePause = 0;
```

In `resetBall`, add a pause instead of immediate launch:

```js
function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 0;
  ball.vy = 0;
  servePause = 60; // 1 second at 60fps

  // Store the serve direction for when the pause ends.
  ball._serveDir = direction;
}
```

In `loop()`, before the ball movement, check the pause:

```js
  if (servePause > 0) {
    servePause = servePause - 1;
    if (servePause === 0) {
      ball.vx = 4 * ball._serveDir;
      ball.vy = (Math.random() - 0.5) * 4;
    }
  }
```

Now after a score, the ball sits at centre for one second before launching. Both players have time to reset their position.

## Centre line

Draw a dashed centre line to make the court feel like a real playing field. Add this in `loop()`, after clearing the canvas but before drawing scores:

```js
  // Centre line
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
```

`setLineDash([8, 8])` creates a dashed pattern: 8 pixels on, 8 pixels off. `setLineDash([])` resets to solid for subsequent drawing.

Save and play. The ball speeds up with each rally. After a score, there's a clean pause before the next serve. The centre line makes the court readable.
