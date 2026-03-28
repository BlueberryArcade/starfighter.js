# Scaling the Ship

The coordinates you drew in Chapter 3 live in a small world — roughly `-5` to `5` on each axis. The game canvas is `800` by `600` pixels. To bridge the gap, we add `ctx.scale()` between the `translate` and the drawing.

## Add a scale constant

At the top of `Ship.js`, below the imports, add:

```js
const SHIP_SCALE = 5;
```

This means one unit in your ship's coordinate space equals 5 pixels on the canvas. If your shape spans from `-4` to `4` on x, that's `8 * 5 = 40` pixels wide — a reasonable ship size.

## Apply it in draw()

Update `draw()` to scale the coordinate system after translating:

```js
draw() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.scale(SHIP_SCALE, SHIP_SCALE);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0.0, -4.0);
  ctx.lineTo(-2.5, 1.0);
  // ... your remaining points
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```

Save and look at the result. The ship should now be a reasonable size.

## Tuning

If the ship is too big, decrease `SHIP_SCALE`. Too small, increase it. The same coordinates produce different sizes — that's the power of drawing in a local coordinate system. The numbers in your `moveTo`/`lineTo` calls never change.

This is exactly what Chapter 3's arrow-key zoom demonstrated: the shape stays the same, only the scale changes. Now you're using that same idea in a real game.

## Why this works

`ctx.translate(this.x, this.y)` moves the origin to the ship's position.
`ctx.scale(SHIP_SCALE, SHIP_SCALE)` multiplies every coordinate after it by the scale factor.

So `ctx.moveTo(0, -4)` becomes pixel `(this.x + 0, this.y + (-4 * 5))` — which is `(this.x, this.y - 20)`. That's the same nose position as the original triangle. The difference is you're expressing it in the coordinate system you designed, not in raw pixels.

## Try it

- Set `SHIP_SCALE` to `1` and watch the ship shrink to near-invisible.
- Set it to `20` and watch it fill the screen.
- Find the value that feels right for your design.
