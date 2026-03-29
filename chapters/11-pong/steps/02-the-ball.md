# The Ball

Start with the simplest thing that moves: a ball that bounces off the top and bottom walls.

Add this to `main.js`:

```js
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 4,
  vy: 3,
  size: 8
};

function loop() {
  // Clear
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update ball
  ball.x = ball.x + ball.vx;
  ball.y = ball.y + ball.vy;

  // Bounce off top and bottom
  if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.vy = -ball.vy;
  }

  // Draw ball
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

Save. A white square bounces endlessly between the top and bottom edges, passing through the left and right sides.

## What you just wrote

You didn't need instructions for any of this. The game loop, the velocity, the bounce check — you've written all of these before. The ball uses `vx` and `vy` like the spray particles and fragments from Starfighter.

The bounce is one line: `ball.vy = -ball.vy`. Negating the vertical velocity reverses direction. Same physics as a mirror — the angle of reflection equals the angle of incidence.

The ball passes through the left and right edges because those are where the paddles will be. No paddle, no bounce — the ball escapes. That's what the next step fixes.
