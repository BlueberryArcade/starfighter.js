# Functions and Keeping things Organized

Take a look at your `loop()` function right now. It's handling movement, clamping, drawing stars, drawing the ship, and managing lasers — all mixed together in one long block. As we add enemies in the next step, it's going to get even longer and harder to read.

This is exactly the problem **functions** solve.

Organization is **key** to coding. Much of coding is managing expanding complexity.

## What is a function?

A function is a named, reusable block of code. You define it once and call it by name whenever you need it. You've already been using built-in functions (`Math.random()`, `ctx.fillRect()`, `requestAnimationFrame()`). Now we'll write our own.

## Refactoring

"Refactoring" means restructuring existing code without changing what it does. We're going to pull chunks of `loop()` into their own functions. The game will behave identically — but the code will be much easier to read, extend, and debug.

Add the following three functions **above** your `loop()` function definition (but below the variable declarations at the top):

### `drawStars()`

```js
// Draws the star field. Called once per frame.
function drawStars() {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < stars.length; i++) {
    ctx.fillRect(stars[i].x, stars[i].y, 2, 2);
  }
}
```

### `drawShip()`

```js
// Draws the player's ship at its current position.
// This function 'reads' shipX and shipY from the outer scope —
// those variables are visible here because they're declared at the top of the file.
function drawShip() {
  ctx.save();
  ctx.translate(shipX, shipY);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-15, 15);
  ctx.lineTo(15, 15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```

### `updateLasers()`

```js
// Moves all active lasers, removes ones that have left the canvas,
// and draws the ones that remain.
function updateLasers() {
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].y = lasers[i].y - 8;

    if (lasers[i].y < 0) {
      lasers.splice(i, 1);
      continue;
    }

    ctx.fillStyle = '#ffff00';
    ctx.fillRect(lasers[i].x - 2, lasers[i].y - 8, 4, 16);
  }
}
```

## Replace the body of `loop()`

Now update `loop()` to call these functions instead of doing the work inline:

```js
function loop() {

  // --- Clear ---
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Background ---
  drawStars();

  // --- Move the ship ---
  const speed = 5;
  if (keys['ArrowLeft'])  { shipX = shipX - speed; }
  if (keys['ArrowRight']) { shipX = shipX + speed; }

  // --- Clamp to canvas ---
  if (shipX < 15)                  { shipX = 15; }
  if (shipX > canvas.width - 15)   { shipX = canvas.width - 15; }

  // --- Draw the ship ---
  drawShip();

  // --- Lasers ---
  updateLasers();

  requestAnimationFrame(loop);
}
```

Save. The game should behave exactly as before — but now `loop()` reads like a clear outline of everything that happens each frame.

## Why bother?

- **Readability** — `drawShip()` is immediately obvious. A 15-line inline drawing block is not.
- **Reuse** — in the next step, we'll draw enemies using almost the same triangle code. With a function, we write it once and call it twice.
- **Debugging** — if the ship drawing is broken, you know exactly where to look.

Good programmers write functions not because the computer needs them, but because humans reading the code — including themselves in two weeks — need them.

In the next step, something is going to fall from the sky.
