# The Animation Loop

Static drawings are a start, but games move. To animate anything in the browser we use `requestAnimationFrame` — a function that tells the browser to call our drawing code before every screen repaint, usually 60 times per second.

## The pattern

```js
function loop() {
  // 1. Clear the screen
  // 2. Draw everything
  // 3. Ask for the next frame
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop); // kick it off
```

## Replace your drawing code

Replace everything after `const ctx = ...` in `main.js` with this:

```js
let shipX = canvas.width / 2;
let shipY = canvas.height / 2;
let angle = 0;

function drawShip(x, y, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-15, 15);
  ctx.lineTo(15, 15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function loop() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  angle += 0.02;
  drawShip(shipX, shipY, angle);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

Save and watch your ship spin. A few new things here:

- `ctx.save()` / `ctx.restore()` — snapshot and restore the canvas state so rotations don't stack up
- `ctx.translate()` moves the origin to the ship's position so we can rotate around its centre
- `ctx.rotate()` takes an angle in **radians** (full rotation = `Math.PI * 2`)

In the next step we'll replace the spin with keyboard controls.
