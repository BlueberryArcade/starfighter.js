# Enemy Makeover

Same pattern, three more files. Each enemy type gets its own coordinate string and scale.

## Enemy.js

Open `Enemy.js`. Add a scale constant at the top:

```js
const ENEMY_SCALE = 5;
```

Replace the `draw()` method's `moveTo`/`lineTo` block with your saved enemy coordinates from Chapter 3, and add `ctx.scale` after `ctx.translate`:

```js
draw() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.scale(ENEMY_SCALE, ENEMY_SCALE);
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  // Your enemy coordinates here:
  ctx.moveTo(-4.0, 0.0);
  ctx.lineTo(-2.0, -2.0);
  ctx.lineTo(2.0, -2.0);
  ctx.lineTo(4.0, 0.0);
  ctx.lineTo(2.0, 2.0);
  ctx.lineTo(-2.0, 2.0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```

## FastEnemy.js and TankEnemy.js

You can give each type its own shape, or reuse the same one at different scales:

- **FastEnemy** — try a smaller, sharper shape. Maybe the same outline scaled at `3` instead of `5`, or a different set of coordinates entirely. Change the colour too — orange (`#ff8800`) is the current default.
- **TankEnemy** — try something big and blocky. A larger scale like `7` or `8` will emphasize the size difference. Purple (`#cc44cc`) is the current colour.

If you didn't draw multiple enemy shapes in Chapter 3, that's fine — you can use one shape at different scales and colours. The visual variety still comes through.

## The important thing

Notice what **didn't** change: `main.js`, the game loop, `updateEnemies()`, `checkCollisions()`, `spawnEnemies()` — none of it. The game loop calls `draw()` on each enemy. Each enemy's `draw()` is self-contained. You changed the internals of three `draw()` methods, and the rest of the game had no idea.

That's polymorphism doing its job.

Save all files and play. You should now have a game with a custom ship and custom enemies — visually distinct from the Chapter 2 version.
