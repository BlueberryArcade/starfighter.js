# Loops and Stars

The game is looking sparse. Let's fill the background with stars — and use that as our introduction to **loops**, one of the most fundamental tools in programming.

We also have a problem: a single laser is very limiting. By the end of this step the player will be able to fire as many lasers as they want. Both problems have the same solution: **arrays** and **loops**.

## What is a loop?

A loop lets you repeat a block of code a set number of times without writing it out manually. The most common kind in JavaScript is the `for` loop:

```js
for (let i = 0; i < 5; i++) {
  // this block runs 5 times, with i = 0, 1, 2, 3, 4
}
```

- `let i = 0` — start with `i` at zero
- `i < 5` — keep looping while this is true
- `i++` — add 1 to `i` after each loop (shorthand for `i = i + 1`)

## Part 1 — The star field

### Create the stars once at startup

Add this code **above** the `loop` function, alongside the other top-level variables:

```js
// An array is an ordered list of values.
// We'll store each star as an object with an x and y property.
const stars = [];

// This for loop runs 80 times, adding one random star each time.
for (let i = 0; i < 80; i++) {
  // Math.random() returns a decimal between 0 and 1.
  // Multiplying by the canvas size spreads stars across the whole canvas.
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  });
}
```

`stars.push(...)` adds a new item to the end of the array. After the loop, `stars` is an array of 80 objects, each with a random `x` and `y`.

### Draw the stars every frame

Inside `loop()`, add this **right after** the background fill and **before** the ship drawing code:

```js
  // --- Draw stars ---
  ctx.fillStyle = '#ffffff';
  // Loop through every star in the array and draw a 2x2 white square.
  for (let i = 0; i < stars.length; i++) {
    ctx.fillRect(stars[i].x, stars[i].y, 2, 2);
  }
```

`stars.length` is how many items are in the array (80). `stars[i]` is the item at position `i` — arrays are zero-indexed, so `stars[0]` is the first star, `stars[79]` is the last.

Save and see the starfield appear. It's created once at startup; we just draw it every frame.

## Part 2 — Multiple lasers

One laser at a time was fine for a proof of concept. Now let's replace it with an array.

### Replace the laser variables

Remove these three lines:

```js
let laserX = 0;
let laserY = 0;
let laserActive = false;
```

And replace them with:

```js
// lasers is an array of active laser objects.
// Each object has an x and y position. The array starts empty.
const lasers = [];
```

### Update the keydown listener

Replace the spacebar block inside your `keydown` listener with:

```js
  // When spacebar is pressed, add a new laser at the ship's nose.
  if (event.key === ' ') {
    lasers.push({ x: shipX, y: shipY - 20 });
  }
```

No more `laserActive` check — the player can now fire freely.

### Replace the laser update code in `loop()`

Remove the old laser block (`if (laserActive) { ... }`) and replace it with:

```js
  // --- Lasers ---
  // We loop backwards (from the end to the start) so that when we remove
  // an item with splice(), the indices of items we haven't checked yet
  // aren't affected. Always loop backwards when removing from an array.
  for (let i = lasers.length - 1; i >= 0; i--) {

    // Move this laser upward.
    lasers[i].y = lasers[i].y - 8;

    // If it's gone off the top of the screen, remove it from the array.
    // splice(i, 1) removes 1 item at index i.
    if (lasers[i].y < 0) {
      lasers.splice(i, 1);
      continue; // skip to the next iteration — this laser is gone
    }

    // Draw this laser.
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(lasers[i].x - 2, lasers[i].y - 8, 4, 16);
  }
```

Save and fire away. You can now shoot as fast as you can press spacebar.

## Loops and arrays — the big idea

Almost everything in games is a collection of things: lasers, enemies, particles, power-ups. Arrays hold those collections. Loops let you do the same operation on every item in a collection without repeating your code. Those two tools, working together, are at the heart of nearly every game loop you'll ever write.

In the next step, we'll look at our `loop()` function. It's getting long — and that's about to become a problem worth solving.
