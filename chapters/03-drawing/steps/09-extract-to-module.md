# Extract to a Module

`main.js` has grown. The drawing tool — its state, event listeners, and drawing code — lives alongside the loop, and the two are starting to tangle. This is the same situation you solved in Chapter 2 by moving code into classes and separate files. Let's do that here.

Create a new file: `src/draw-tool.js`.

Move the drawing tool's state, handlers, and drawing function into it:

```js
// src/draw-tool.js
import { canvasToWorld } from './coords.js';

let shapes = [];
let points = [];
let rects = [];
let mouseX = 0;
let mouseY = 0;
let mouseDownX = null;
let mouseDownY = null;
let tool = 'line';

export function initDrawTool(canvas, range) {
  console.log('tool', tool);

  window.addEventListener('keydown', function(event) {
    if (event.key === 'l') { tool = 'line'; console.log('tool', tool); }
    if (event.key === 'r') { tool = 'rect'; console.log('tool', tool); }
  });

  canvas.addEventListener('mousemove', function(event) {
    const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
    mouseX = p.x;
    mouseY = p.y;
  });

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

  canvas.addEventListener('mouseup', function(event) {
    if (tool === 'rect' && mouseDownX !== null) {
      const p = canvasToWorld(event.offsetX, event.offsetY, canvas, range);
      rects.push({ x: mouseDownX, y: mouseDownY, w: p.x - mouseDownX, h: p.y - mouseDownY });
    }
    mouseDownX = null;
    mouseDownY = null;
  });

  canvas.addEventListener('dblclick', function(event) {
    if (tool === 'line' && points.length >= 2) {
      shapes.push([...points]);
      points = [];
    }
  });
}

export function drawTool(ctx) {
  // Completed polygons
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

  // Completed rects
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 0.05;
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    ctx.strokeRect(r.x, r.y, r.w, r.h);
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

  // In-progress rect preview
  if (tool === 'rect' && mouseDownX !== null) {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.05;
    ctx.strokeRect(mouseDownX, mouseDownY, mouseX - mouseDownX, mouseY - mouseDownY);
  }
}
```

## Clean up `main.js`

Remove all the drawing tool state and listeners from `main.js`. Add the import and a single init call. Your `main.js` should now look like this:

```js
import { setupCoords, drawGrid } from './coords.js';
import { initDrawTool, drawTool } from './draw-tool.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const range = 10;

initDrawTool(canvas, range);

function loop() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, canvas, range);

  ctx.save();
  setupCoords(ctx, canvas, range);
  drawTool(ctx);
  ctx.restore();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

Save and confirm everything still works.

## What just happened

`main.js` went from ~80 lines to ~25. The drawing tool is now self-contained — it manages its own state and its own listeners. `main.js` just sets the stage and runs the loop. This is the same principle as Chapter 2: keep things that belong together in the same place, and keep things that don't belong together apart. Code that's easy to read is also easier to change.
