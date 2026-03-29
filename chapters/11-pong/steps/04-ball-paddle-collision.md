# Ball-Paddle Collision

The ball passes through both paddles. Let's make it bounce.

## Collision detection

A collision happens when the ball overlaps a paddle rectangle. Add this function:

```js
function checkPaddleCollision(paddle) {
  if (
    ball.x - ball.size / 2 < paddle.x + paddleWidth &&
    ball.x + ball.size / 2 > paddle.x &&
    ball.y - ball.size / 2 < paddle.y + paddleHeight &&
    ball.y + ball.size / 2 > paddle.y
  ) {
    // Reverse horizontal direction.
    ball.vx = -ball.vx;

    // Where on the paddle did the ball hit?
    // 0 = top edge, 0.5 = centre, 1 = bottom edge.
    const hitPoint = (ball.y - paddle.y) / paddleHeight;

    // Deflect the ball based on where it hit.
    // Centre hits go straight. Edge hits go at a steep angle.
    ball.vy = (hitPoint - 0.5) * 8;

    // Push the ball outside the paddle so it doesn't collide again next frame.
    if (ball.vx > 0) {
      ball.x = paddle.x + paddleWidth + ball.size / 2;
    } else {
      ball.x = paddle.x - ball.size / 2;
    }
  }
}
```

Call it in `loop()`, after moving the ball:

```js
  checkPaddleCollision(left);
  checkPaddleCollision(right);
```

## How the deflection works

`hitPoint` ranges from `0` (top of paddle) to `1` (bottom). Subtracting `0.5` centres it: `-0.5` (top) to `0.5` (bottom). Multiplying by `8` scales it into a meaningful velocity.

The result: hitting the centre of the paddle sends the ball nearly horizontal. Hitting the edge sends it at a steep angle. This gives the player control over where the ball goes — the core skill in Pong.

## The push-out

Without the push-out (`ball.x = paddle.x + ...`), the ball can get stuck inside the paddle. It collides, reverses direction, is still overlapping next frame, reverses again — and vibrates in place. Moving the ball just outside the paddle prevents this.

## Try it

- Hit the ball with the edge of the paddle and watch it deflect steeply.
- Hit it with the centre — nearly flat return.
- Try to angle the ball past your opponent.
