# Scale with Arrow Keys

The `range` variable controls how much of the world fits on screen. Right now it's `const range = 10`. Let's make it adjustable with the arrow keys so you can zoom in and out while you're drawing.

## Make range mutable

In `main.js`, change `const range = 10` to `let range = 10`. Then add a keydown listener:

```js
window.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp')   { range = Math.max(1, range - 1); }
  if (event.key === 'ArrowDown') { range = range + 1; }
  console.log('range', range);
});
```

Save and try it. With your ship drawn, press the up arrow — the view zooms in (range decreases, each unit covers more pixels, the shape appears larger). Press down — it shrinks back.

## Why this works

The shape's coordinates haven't changed. The points you drew at `(0.0,-4.0)`, `(-3.0,2.0)`, and `(3.0,2.0)` are still exactly those values. What changed is the *scale* — how many pixels equal one unit. A smaller range means a larger scale, so the same coordinates map to more pixels.

This is the advantage of drawing in a world coordinate system instead of pixels. You think in units, the coordinate system handles the pixels. In Chapter 4, your ship class will use the same pattern: draw the ship around `(0, 0)` in its own coordinate space, then translate and scale to place it anywhere on the game canvas at any size.

## A practical use

If your ship feels too small at `range = 10`, zoom in with the arrow keys to get a better look at the details. When you're done and copy the coordinates, they're still the same numbers — they'll appear at whatever size makes sense in the game.

## The drawing tool and range

The drawing tool captures coordinates at the range that was active when you called `initDrawTool(canvas, range)`. Since we pass the initial `range` value at startup, new clicks will still use `range = 10` coordinates internally — the zoom is visual only. That's actually what you want: your saved coordinates are always in the same space regardless of zoom level.

Try drawing a new shape while zoomed in. The coordinate string still uses the same scale, just with more precision in the smaller numbers.
