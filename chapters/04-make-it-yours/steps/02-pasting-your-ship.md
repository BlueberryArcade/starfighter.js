# Pasting Your Ship

Open `Ship.js` and look at the `draw()` method:

```js
draw() {
  ctx.save();
  ctx.translate(this.x, this.y);
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

Three points. A cyan triangle. That's the placeholder. Let's replace it with the coordinate string you saved in Chapter 3.

## Paste your coordinates

Find the comment where you saved your ship's coordinate string — something like:

```
// Ship points: (0.0,-4.0) (-2.5,1.0) (-4.0,2.5) (0.0,1.5) (4.0,2.5) (2.5,1.0)
```

Replace the `moveTo`/`lineTo` block inside `draw()` with calls that match your string. The first coordinate becomes `moveTo`, the rest become `lineTo`:

```js
draw() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0.0, -4.0);
  ctx.lineTo(-2.5, 1.0);
  ctx.lineTo(-4.0, 2.5);
  ctx.lineTo(0.0, 1.5);
  ctx.lineTo(4.0, 2.5);
  ctx.lineTo(2.5, 1.0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```

Save and look at the game.

## What you'll see

The ship probably looks wrong. Either it's tiny — a barely visible speck near the bottom of the screen — or it's enormous and fills half the canvas. That's expected.

The problem: in Chapter 3 you drew in a coordinate space where `-10` to `10` covered the full screen. Here, the canvas is `800` by `600` pixels, and `ctx.translate` positions the ship in pixel coordinates. A point at `(4.0, 2.5)` is 4 pixels from centre — practically invisible.

We need to **scale** your coordinates up to pixel size. That's the next step.
