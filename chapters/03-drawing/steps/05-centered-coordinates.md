# Centered Coordinates

Right now the canvas uses its default coordinate system: `(0, 0)` at the top-left, one unit equals one pixel, `x` grows right, `y` grows down. That works, but it has a quirk: drawing a ship centred at the origin means calculating everything relative to the top-left corner of an 800×600 screen.

There's a better way. In Chapter 1 you used `ctx.translate()` to move the origin to the ship's position before drawing — so all the ship's points could be simple numbers like `-15` and `20` rather than `shipX - 15` and `shipY + 20`. We're going to apply that same idea globally: move the origin to the centre of the canvas, and define our own unit scale.

## Create `src/coords.js`

Create a new file called `coords.js` in the `src/` folder and paste this in:

```js
// The canvas spans from -RANGE to +RANGE on the Y axis.
// X gets proportionally more space on a widescreen canvas.
const RANGE = 10;

function getScale(canvas, range) {
  return canvas.height / 2 / range;
}

// Set up the canvas transform so (0,0) is centre, and one unit
// equals (canvas.height / 2 / range) pixels.
export function setupCoords(ctx, canvas, range) {
  const scale = getScale(canvas, range);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);
}

// Convert a canvas pixel position (from a mouse event) to world coordinates.
export function canvasToWorld(canvasX, canvasY, canvas, range) {
  const scale = getScale(canvas, range);
  return {
    x: (canvasX - canvas.width / 2) / scale,
    y: (canvasY - canvas.height / 2) / scale
  };
}

// Draw a grid to visualise the coordinate system.
export function drawGrid(ctx, canvas, range) {
  const scale = getScale(canvas, range);
  const lw = 1 / scale;                     // 1 pixel expressed in world units
  const xRange = canvas.width / 2 / scale;  // how far x extends on this canvas

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(scale, scale);

  // Minor grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = lw;
  for (let x = Math.ceil(-xRange); x <= Math.floor(xRange); x++) {
    ctx.beginPath();
    ctx.moveTo(x, -range);
    ctx.lineTo(x, range);
    ctx.stroke();
  }
  for (let y = -range; y <= range; y++) {
    ctx.beginPath();
    ctx.moveTo(-xRange, y);
    ctx.lineTo(xRange, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = lw * 2;
  ctx.beginPath(); ctx.moveTo(0, -range); ctx.lineTo(0, range); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-xRange, 0); ctx.lineTo(xRange, 0); ctx.stroke();

  ctx.restore();
}
```

## Update `main.js`

Add this import at the very top:

```js
import { setupCoords, canvasToWorld, drawGrid } from './coords.js';
```

Add a `range` constant and update the state variables:

```js
const range = 10;
```

Update all three mouse listeners to convert coordinates:

```js
canvas.addEventListener('mousemove', function(event) {
  const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
  mouseX = p.x;
  mouseY = p.y;
  console.log('mouse', mouseX.toFixed(1) + ', ' + mouseY.toFixed(1));
});

canvas.addEventListener('mousedown', function(event) {
  const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
  mouseDownX = p.x;
  mouseDownY = p.y;
});

canvas.addEventListener('mouseup', function(event) {
  if (mouseDownX !== null) {
    const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
    rects.push({ x: mouseDownX, y: mouseDownY, w: p.x - mouseDownX, h: p.y - mouseDownY });
  }
  mouseDownX = null;
  mouseDownY = null;
});
```

Update `loop()` to draw the grid and use the coordinate system for shapes:

```js
function loop() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, canvas, range);

  ctx.save();
  setupCoords(ctx, canvas, range);

  // Inside setupCoords, one unit ≠ one pixel — use small lineWidth values.
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.05;
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  }

  if (mouseDownX !== null) {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.strokeRect(mouseDownX, mouseDownY, mouseX - mouseDownX, mouseY - mouseDownY);
  }

  ctx.restore();

  requestAnimationFrame(loop);
}
```

Save and try drawing. The grid is now visible. Mouse coordinates in the watch panel run roughly from `-13` to `13` on x (the canvas is wider than it is tall) and from `-10` to `10` on y. The centre of the screen is `0, 0`.

## Why `lineWidth = 0.05`?

After `setupCoords` scales up by 30× (for `range = 10` on a 600px-tall canvas), a `lineWidth` of `1` would be 30 pixels on screen. We want thin lines — so we use a fraction: `0.05` becomes 1.5 pixels. Try changing it to see the effect.

## Try it

- Change `const range = 10` to `const range = 5`. The grid zooms in, each unit covers more screen space.
- Try `const range = 20`. Everything shrinks.
- Draw a rectangle centred at `(0, 0)`. Does it appear in the middle of the canvas?
