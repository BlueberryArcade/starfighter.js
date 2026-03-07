# Firing Lasers

It's time to shoot. We'll start with a single laser: either it's there or it isn't. That state — *does a laser currently exist?* — is tracked with a variable.

## Laser state variables

Add these three variables near the top of `main.js`, alongside `shipX` and `shipY`:

```js
// A laser needs to know where it is and whether it's currently in flight.
// When laserActive is false, we ignore laserX and laserY entirely.
let laserX = 0;
let laserY = 0;
let laserActive = false;
```

## Firing on spacebar

Inside the `keydown` listener you wrote in step 4, add a check for the spacebar.
Update the listener to look like this:

```js
window.addEventListener('keydown', function(event) {
  keys[event.key] = true;

  // Fire a laser when the spacebar is pressed — but only if
  // one isn't already in flight. The ' ' string is the spacebar.
  if (event.key === ' ' && !laserActive) {
    // Place the laser at the tip of the ship's nose.
    // shipY - 20 matches the nose point in our triangle drawing code.
    laserX = shipX;
    laserY = shipY - 20;
    laserActive = true;
  }
});
```

`!laserActive` means "laserActive is false." So the full condition reads: "if the spacebar was pressed AND there's no laser currently active, fire one."

## Moving and drawing the laser

Add this block **inside `loop()`**, after the ship drawing code:

```js
  // --- Laser ---
  // We only do anything with the laser when it's active.
  if (laserActive) {

    // Move the laser upward each frame.
    // Subtracting from Y moves things toward the top of the canvas.
    laserY = laserY - 8;

    // If the laser has flown past the top of the canvas, deactivate it
    // so the player can fire again.
    if (laserY < 0) {
      laserActive = false;
    }

    // Draw the laser as a narrow bright rectangle.
    ctx.fillStyle = '#ffff00';
    // fillRect(x, y, width, height) — we center it on laserX.
    ctx.fillRect(laserX - 2, laserY - 8, 4, 16);
  }
```

Save and press spacebar. A yellow streak fires upward from the ship's nose.

## Two `if` statements working together

Notice how two separate conditions gate two different things:

- The outer `if (laserActive)` skips all laser logic when there's nothing to update.
- The inner `if (laserY < 0)` cleans up when the laser exits the canvas.

This pattern — checking state before acting, then checking the result after acting — is something you'll use constantly.

## The `&&` operator

`event.key === ' ' && !laserActive` uses `&&` (logical AND). It evaluates to `true` only when **both** sides are true. If either side is false, the whole condition is false and the `if` block doesn't run.

JavaScript also has `||` (logical OR), which is true when **either** side is true. You'll use both.

In the next step, we'll add a starfield to fill the void of space — and that's going to require a loop.
