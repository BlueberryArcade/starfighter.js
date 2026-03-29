# A Player Class

The paddle code is duplicated — the same movement logic, the same clamping, the same drawing, repeated for `left` and `right`. This is the same problem we solved in Chapter 2 with the Ship class, and in Chapter 5 with BaseEnemy.

## Create `src/Player.js`

```js
export default class Player {
  constructor({ x, upKey, downKey, canvasHeight }) {
    this.x = x;
    this.y = canvasHeight / 2 - 40;
    this.width = 12;
    this.height = 80;
    this.speed = 6;
    this.score = 0;
    this.upKey = upKey;
    this.downKey = downKey;
    this.canvasHeight = canvasHeight;
  }

  update(keys) {
    if (keys[this.upKey]) { this.y = this.y - this.speed; }
    if (keys[this.downKey]) { this.y = this.y + this.speed; }
    if (this.y < 0) { this.y = 0; }
    if (this.y + this.height > this.canvasHeight) {
      this.y = this.canvasHeight - this.height;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
```

The constructor takes a configuration object — the same destructuring pattern from Chapter 7. Each player carries its own position, key bindings, and score.

## Update `main.js`

Import the class and create two instances:

```js
import Player from './Player.js';

const player1 = new Player({
  x: 20,
  upKey: 'w',
  downKey: 's',
  canvasHeight: canvas.height
});

const player2 = new Player({
  x: canvas.width - 32,
  upKey: 'ArrowUp',
  downKey: 'ArrowDown',
  canvasHeight: canvas.height
});
```

Remove the old `left`, `right`, `paddleWidth`, `paddleHeight`, `paddleSpeed`, `scoreLeft`, and `scoreRight` variables.

Replace all references:
- `left` → `player1`, `right` → `player2`
- `scoreLeft` → `player1.score`, `scoreRight` → `player2.score`
- `paddleWidth` → `player1.width`, `paddleHeight` → `player1.height`

Update `loop()`:

```js
  player1.update(keys);
  player2.update(keys);

  // ... ball logic, collision checks ...

  player1.draw(ctx);
  player2.draw(ctx);
```

Update `checkPaddleCollision` to use `paddle.width` and `paddle.height` instead of the old constants.

Update scoring:

```js
  if (ball.x < 0) {
    player2.score = player2.score + 1;
    if (player2.score >= winScore) { gameOver = true; winner = 'Player 2'; }
    playScore();
    resetBall(1);
  }

  if (ball.x > canvas.width) {
    player1.score = player1.score + 1;
    if (player1.score >= winScore) { gameOver = true; winner = 'Player 1'; }
    playScore();
    resetBall(-1);
  }
```

Update the score display:

```js
  ctx.fillText(String(player1.score), canvas.width / 4, 70);
  ctx.fillText(String(player2.score), canvas.width * 3 / 4, 70);
```

Update the restart block:

```js
  if ((event.key === 'r' || event.key === 'R') && gameOver) {
    player1.score = 0;
    player2.score = 0;
    gameOver = false;
    winner = '';
    resetBall(1);
  }
```

Save and confirm the game plays exactly the same.

## Why this matters for networking

In the next chapter, one of these players will be controlled by keyboard input, and the other by messages from the network. The `Player` class doesn't know or care where its input comes from — it just needs someone to call `update()`. That abstraction is what makes the networked version possible without rewriting the game.
