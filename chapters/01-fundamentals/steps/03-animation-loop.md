# The Animation Loop

The ship is on screen — but it's frozen. Games need motion, and motion means running your drawing code over and over, many times per second. To do that we use `requestAnimationFrame`.

## How it works

`requestAnimationFrame(loop)` says: "Before you paint the next frame on screen, call `loop` first." If `loop` schedules itself again at the end of its body, you get a continuous cycle — roughly 60 times per second.

```
1. loop runs
2. draws the frame
3. schedules itself
4. loop runs
5. ...
```

## Repositioning the ship

Let's put the player ship at the **bottom** of the screen. We'll also switch from `const` to `let` for the ship's position, because in the next step we'll be changing those values. `const` values never change. The `let` "keyword" allows them to change.

## Replace your drawing code

Replace everything after `const ctx = canvas.getContext('2d');` in `main.js` with this:

```js
// The ship starts near the bottom-center of the canvas.
// 'let' instead of 'const' because these values will change soon.
let shipX = canvas.width / 2;
let shipY = canvas.height - 60;

// loop() is the heartbeat of the game.
// Called right before every screen repaint (~60 times per second).
function loop() {

  // --- Clear the screen ---
  // We redraw the entire canvas every frame.
  // Without this, each frame would be drawn on top of the last one —
  // you'd end up with a smeared trail instead of a moving ship.
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // --- Draw the ship ---

  // ctx.save() takes a snapshot of the canvas's current drawing state:
  // its coordinate origin, any active rotation, color settings, etc.
  ctx.save();

  // ctx.translate() moves the coordinate origin to the ship's position.
  // After this call, (0, 0) means "the center of the ship" for everything
  // drawn until ctx.restore() is called. This lets us draw the triangle
  // using simple numbers like -20 and 15 rather than shipX-related math.
  ctx.translate(shipX, shipY);

  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0, -20);    // nose — 20px above the ship's center
  ctx.lineTo(-15, 15);   // bottom-left wing
  ctx.lineTo(15, 15);    // bottom-right wing
  ctx.closePath();
  ctx.fill();

  // ctx.restore() returns the canvas state to the snapshot we took above.
  // This undoes the translate so future draw calls aren't shifted by the
  // ship's position. Try removing save/restore and see what happens.
  ctx.restore();

  // Schedule the next call to loop() before the next repaint.
  requestAnimationFrame(loop);
}

// Kick off the loop for the first time.
requestAnimationFrame(loop);
```

Save the file. The ship should now appear at the **bottom-center** of the canvas, sitting still. Nothing moves yet — but the loop is running 60 times per second, quietly redrawing the same frame, waiting for something to change.

## Why `save` and `restore`?

`ctx.translate()` doesn't just affect the next draw call — it permanently shifts the canvas's coordinate system until you undo it. Without `save`/`restore`, each frame would inherit the previous frame's translation, and the ship would drift further and further off screen.

`ctx.save()` and `ctx.restore()` work like a "stack" of cards: `save` pushes the current state, `restore` pops it. Every `translate`, `rotate`, or `scale` you apply between them is automatically undone when you restore. You'll use this pattern constantly.

In the next step, we'll make the ship respond to the keyboard.
