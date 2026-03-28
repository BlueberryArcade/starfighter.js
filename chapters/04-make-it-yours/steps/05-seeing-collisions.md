# Seeing Collisions

Play the game with your new shapes. You'll probably notice something is off: lasers pass through enemies without hitting them, or collisions trigger when the projectile is clearly in empty space. The `radius` on each class was calibrated for the old triangles — your shapes are different sizes.

Before we can fix this, we need to **see** what's happening.

## Add a debug toggle

Open `main.js`. Near the top, alongside the other state variables, add:

```js
let debug = false;
```

In the `keydown` listener, add a toggle:

```js
  if (event.key === 'd') { debug = !debug; }
```

## Draw collision circles

Now we need to draw a circle at each object's position with a radius matching its `radius` property. Add this function in `main.js`:

```js
function drawDebugCircle(x, y, radius) {
  if (!debug) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
```

Now call it in `loop()`, right after each object draws itself. After `ship.draw()`:

```js
  drawDebugCircle(ship.x, ship.y, 15);
```

The ship doesn't have a `radius` property — collisions use a hardcoded `15` in the power-up collection code. We're using that same value here so you can see what the game actually checks.

For enemies, add the call inside `updateEnemies()`, right after `enemies[i].draw()`:

```js
    drawDebugCircle(enemies[i].x, enemies[i].y, enemies[i].radius);
```

Save, play, and press `d`. Semi-transparent red circles appear around every enemy and the ship. Some circles will be too big for the shape. Others too small. Now you can see the mismatch — and in the next step, you'll fix it.
