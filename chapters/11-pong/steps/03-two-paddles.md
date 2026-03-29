# Two Paddles

This is the first time two humans share one screen. Each player gets their own controls.

## Add the paddles

```js
const paddleWidth = 12;
const paddleHeight = 80;
const paddleSpeed = 6;

const left = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  upKey: 'w',
  downKey: 's'
};

const right = {
  x: canvas.width - 20 - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  upKey: 'ArrowUp',
  downKey: 'ArrowDown'
};
```

Player 1 uses W and S. Player 2 uses the arrow keys. Both players share the keyboard — one on the left side, one on the right.

## Track keys

```js
const keys = {};

window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});
```

Same pattern as Starfighter. One `keys` object tracks all pressed keys regardless of which player pressed them.

## Move paddles in the loop

Add this to `loop()`, before the ball update:

```js
  // Move left paddle
  if (keys[left.upKey]) { left.y = left.y - paddleSpeed; }
  if (keys[left.downKey]) { left.y = left.y + paddleSpeed; }
  if (left.y < 0) { left.y = 0; }
  if (left.y + paddleHeight > canvas.height) { left.y = canvas.height - paddleHeight; }

  // Move right paddle
  if (keys[right.upKey]) { right.y = right.y - paddleSpeed; }
  if (keys[right.downKey]) { right.y = right.y + paddleSpeed; }
  if (right.y < 0) { right.y = 0; }
  if (right.y + paddleHeight > canvas.height) { right.y = canvas.height - paddleHeight; }
```

## Draw paddles

Add this to `loop()`, after the ball drawing:

```js
  // Draw paddles
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(left.x, left.y, paddleWidth, paddleHeight);
  ctx.fillRect(right.x, right.y, paddleWidth, paddleHeight);
```

Save. Two white rectangles on the left and right edges, each controlled by different keys. Try pressing W and ArrowUp at the same time — both paddles move independently.

## Two players, one keyboard

This is the simplest form of multiplayer: two humans sitting next to each other, sharing a physical device. No networking, no synchronization — just two sets of controls mapped to two objects. The game doesn't know or care that there are two humans. It just reads the `keys` object and moves the paddles.
