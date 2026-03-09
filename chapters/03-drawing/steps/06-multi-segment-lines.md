# Multi-Segment Lines

Rectangles are useful, but ship shapes aren't rectangles. Let's switch to a tool that lets you place points one click at a time and draws lines between them — a polygon tool.

Replace the rect state and all three mouse listeners with the following:

```js
const shapes = []; // completed polygons
let points = [];   // points in the current path
let mouseX = 0;
let mouseY = 0;
```

```js
canvas.addEventListener('mousemove', function(event) {
  const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
  mouseX = p.x;
  mouseY = p.y;
});

canvas.addEventListener('mousedown', function(event) {
  // event.detail is 1 for a normal click, 2 for the second press of a double-click.
  // We skip adding a point on double-click — that gesture is reserved for filling.
  if (event.detail >= 2) return;

  const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
  points.push(p);

  // Build a coordinate string from all points so far.
  const coords = points.map(function(pt) {
    return '(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ')';
  }).join(' ');
  console.log('points', coords);
});
```

Now update `loop()` to draw the shape in progress. Replace the rect-drawing section inside `ctx.save()` / `ctx.restore()` with this:

```js
  ctx.save();
  setupCoords(ctx, canvas, range);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.05;

  // Draw completed shapes.
  for (let i = 0; i < shapes.length; i++) {
    const pts = shapes[i];
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let j = 1; j < pts.length; j++) {
      ctx.lineTo(pts[j].x, pts[j].y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Draw the current in-progress path, with a preview line to the cursor.
  if (points.length > 0) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.stroke();
  }

  ctx.restore();
```

Save and try it. Click several points — each click adds a vertex, and a ghost line follows your cursor to show where the next segment will go. The watch panel shows all the coordinates so far as a string like `(-3.2,1.0) (0.0,-4.5) (3.1,1.0)`.

## The coordinate string

That string in the watch panel is the key to this tool. It's a text representation of the shape you're drawing. You can **select and copy it** directly from the watch panel. Later, when you want to draw the same shape in code, you have the exact coordinates to paste into `moveTo` and `lineTo` calls.

Try drawing a triangle with three clicks. Note the coordinates. In the next step we'll fill the shape and reset for a new one.
