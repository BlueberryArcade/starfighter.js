# Drawing with Mouse

Let's build something interactive. We're going to let the user draw rectangles by clicking and dragging — press to set one corner, release to set the other.

This is a clean break from the Hello World scene, so replace everything below the first two lines of `main.js` with the code below:

```js
const rects = [];
let mouseX = 0;
let mouseY = 0;
let mouseDownX = null;
let mouseDownY = null;

canvas.addEventListener('mousemove', function(event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

canvas.addEventListener('mousedown', function(event) {
  mouseDownX = event.offsetX;
  mouseDownY = event.offsetY;
});

canvas.addEventListener('mouseup', function(event) {
  if (mouseDownX !== null) {
    rects.push({
      x: mouseDownX,
      y: mouseDownY,
      w: event.offsetX - mouseDownX,
      h: event.offsetY - mouseDownY
    });
  }
  mouseDownX = null;
  mouseDownY = null;
});

function loop() {
  // Clear the canvas.
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw all completed rectangles.
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  }

  // Draw the in-progress rectangle while the mouse is held down.
  if (mouseDownX !== null) {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.strokeRect(mouseDownX, mouseDownY, mouseX - mouseDownX, mouseY - mouseDownY);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

Save and try it. Click and drag to draw rectangles. Release the mouse to lock one in. Draw a few more — they all stay.

## How it works

`mousedown` records where the drag started. `mouseup` stores the finished rectangle in the `rects` array. Between those events, `mousemove` keeps `mouseX` and `mouseY` current so the loop can draw the preview.

The loop runs every frame. It clears the screen, redraws all completed rectangles from the array, then — if the mouse is currently held down — draws the ghost preview using the semi-transparent colour.

This "store shapes, redraw everything each frame" pattern is fundamental to canvas drawing. The canvas has no memory of what you drew — if you don't redraw it, it's gone. The array *is* the drawing.

## Try it

- Notice how `w` and `h` can be negative if you drag up or to the left. `strokeRect` handles negative dimensions just fine — the rectangle appears on the correct side.
- What happens if you log `rects.length` with the watch syntax?
