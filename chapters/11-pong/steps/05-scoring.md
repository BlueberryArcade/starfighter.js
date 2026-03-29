# Scoring

When the ball passes a paddle and reaches the left or right edge, the other player scores.

## Add scores

```js
let scoreLeft = 0;
let scoreRight = 0;
let gameOver = false;
let winner = '';
const winScore = 5;
```

## Detect scoring

In `loop()`, after the ball update and collision checks, add:

```js
  // Ball passed the left edge — right player scores.
  if (ball.x < 0) {
    scoreRight = scoreRight + 1;
    if (scoreRight >= winScore) {
      gameOver = true;
      winner = 'Player 2';
    }
    resetBall(1);
  }

  // Ball passed the right edge — left player scores.
  if (ball.x > canvas.width) {
    scoreLeft = scoreLeft + 1;
    if (scoreLeft >= winScore) {
      gameOver = true;
      winner = 'Player 1';
    }
    resetBall(-1);
  }
```

## Reset the ball

```js
function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 4 * direction;
  ball.vy = (Math.random() - 0.5) * 4;
}
```

The `direction` parameter sends the ball toward the player who was just scored on — they get to receive the serve. The `vy` is randomized so the serve isn't identical every time.

## Draw the scores

Add to `loop()`, after clearing the canvas:

```js
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '64px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(scoreLeft), canvas.width / 4, 70);
  ctx.fillText(String(scoreRight), canvas.width * 3 / 4, 70);
```

The scores are drawn at 30% opacity so they feel like part of the background, not the foreground.

## Game over screen

Wrap the game logic in an `if (!gameOver)` check. Add the game-over display:

```js
  if (gameOver) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px monospace';
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 30);
  }
```

## Restart

In the `keydown` listener:

```js
  if ((event.key === 'r' || event.key === 'R') && gameOver) {
    scoreLeft = 0;
    scoreRight = 0;
    gameOver = false;
    winner = '';
    resetBall(1);
  }
```

Save and play. Score 5 points to win. The game is playable.
