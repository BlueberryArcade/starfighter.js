# Tool Switching

Let's bring back the rectangle tool and add keyboard shortcuts to switch between the two. We'll also log the active tool to the watch panel so you always know which mode you're in.

## Add the rect state back

Add these alongside your existing state variables:

```js
const rects = [];
let mouseDownX = null;
let mouseDownY = null;
let tool = 'line';

console.log('tool', tool);
```

## Switch on keypress

Add a keyboard listener:

```js
window.addEventListener('keydown', function(event) {
  if (event.key === 'l') { tool = 'line'; console.log('tool', tool); }
  if (event.key === 'r') { tool = 'rect'; console.log('tool', tool); }
});
```

## Update the mouse listeners

The `mousedown` handler needs to branch on the current tool:

```js
canvas.addEventListener('mousedown', function(event) {
  if (event.detail >= 2) return;
  const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);

  if (tool === 'rect') {
    mouseDownX = p.x;
    mouseDownY = p.y;
  } else {
    points.push(p);
    const coords = points.map(function(pt) {
      return '(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ')';
    }).join(' ');
    console.log('points', coords);
  }
});
```

Add `mouseup` back for the rect tool:

```js
canvas.addEventListener('mouseup', function(event) {
  if (tool === 'rect' && mouseDownX !== null) {
    const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
    rects.push({ x: mouseDownX, y: mouseDownY, w: p.x - mouseDownX, h: p.y - mouseDownY });
  }
  mouseDownX = null;
  mouseDownY = null;
});
```

Update `dblclick` to check the current tool:

```js
canvas.addEventListener('dblclick', function(event) {
  if (tool === 'line' && points.length >= 2) {
    shapes.push([...points]);
    points = [];
  }
});
```

## Update the loop

Inside `ctx.save()` / `ctx.restore()`, add rect drawing and update the in-progress previews:

```js
  // Completed rects
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.05;
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  }

  // In-progress rect preview
  if (tool === 'rect' && mouseDownX !== null) {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.05;
    ctx.strokeRect(mouseDownX, mouseDownY, mouseX - mouseDownX, mouseY - mouseDownY);
  }

  // In-progress polygon preview
  if (tool === 'line' && points.length > 0) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 0.05;
    ctx.stroke();
  }
```

Save and test. Press `r` and the watch panel shows `tool = rect`. Press `l` and it switches back. The active tool is always visible without any extra UI.

## Try it

- Draw a rectangle frame and fill it with a polygon shape.
- Notice that switching tools mid-polygon doesn't lose your current points — finish the polygon first, then switch.
