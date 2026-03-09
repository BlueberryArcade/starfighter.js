# Close and Fill

Right now your path grows forever. Let's add a gesture to seal it: double-click to fill the shape and start fresh.

Add this listener after the `mousedown` listener:

```js
canvas.addEventListener('dblclick', function(event) {
  if (points.length < 2) return;
  shapes.push([...points]); // save a copy of the current points
  points = [];               // reset for the next shape
});
```

And update the completed-shapes drawing in `loop()` to fill them:

```js
  for (let i = 0; i < shapes.length; i++) {
    const pts = shapes[i];
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let j = 1; j < pts.length; j++) {
      ctx.lineTo(pts[j].x, pts[j].y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.05;
    ctx.stroke();
  }
```

Save and try it. Click several points, then double-click to finish. The shape fills with a faint white and the next click starts a new path.

## The copy workflow

When you finish a shape, the coordinate string is still sitting in the watch panel — the one that was logged on your last single click, before the double-click. **Select it and copy it before you click again**, because the next click will overwrite it with the new shape's coordinates.

Here's what a copied string might look like:

```
(-3.2,1.0) (0.0,-4.5) (3.1,1.0)
```

To draw this shape in code, you'd translate that into:

```js
ctx.beginPath();
ctx.moveTo(-3.2, 1.0);
ctx.lineTo(0.0, -4.5);
ctx.lineTo(3.1, 1.0);
ctx.closePath();
ctx.fill();
```

The tool gives you the points. You decide what to do with them. The important thing is that the coordinate system you're drawing in now is the same one your ship will use in the game — so these numbers transfer directly.

## Try it

- Draw a triangle, fill it, then draw a rectangle shape around it.
- Try an L-shape or a star with many points.
- Fill a shape and immediately copy the coordinate string — then paste it somewhere as a comment in your code so you don't lose it.
