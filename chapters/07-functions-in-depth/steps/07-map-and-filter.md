# Map and Filter

Since Chapter 1, you've been writing `for` loops to process arrays. Every enemy update, every collision check, every projectile draw — a `for` loop with an index variable. JavaScript arrays have built-in methods that do the same work with less code and a clearer intent.

## filter

`filter` creates a new array containing only the elements that pass a test:

```js
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter((n) => n % 2 === 0);
// evens is [2, 4, 6]
```

The callback `(n) => n % 2 === 0` is called for every element. If it returns `true`, the element is kept. If `false`, it's excluded.

## Replacing the splice loop

Look at the projectile update pattern that appears throughout the game:

```js
for (let i = projectiles.length - 1; i >= 0; i--) {
  projectiles[i].update();
  if (projectiles[i].isOffScreen()) {
    projectiles.splice(i, 1);
    continue;
  }
  projectiles[i].draw();
}
```

We loop backward, splice out dead projectiles, and draw the rest. It works, but the backward loop exists only because `splice` shifts indices. With `filter`, the intent is clearer. Here's an alternative approach — separate the update from the removal:

```js
// Update all.
projectiles.forEach((p) => p.update());

// Remove dead ones.
projectiles = projectiles.filter((p) => !p.isOffScreen());

// Draw survivors.
projectiles.forEach((p) => p.draw());
```

**Important:** `filter` returns a **new array**. It doesn't modify the original. That's why we reassign `projectiles = projectiles.filter(...)`. For this to work, `projectiles` must be declared with `let` instead of `const`. The old array is discarded; the new one replaces it.

This is a different philosophy from the splice approach. Splice **mutates** — it changes the array in place. Filter creates a **new value**. Both work. The splice version is faster for very large arrays. The filter version is easier to read and reason about.

## map

`map` creates a new array by transforming each element:

```js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
// doubled is [2, 4, 6, 8, 10]
```

The callback receives each element and returns the transformed version.

A practical use in the game — generating a formation:

```js
const positions = [0, 1, 2, 3, 4].map((i) => ({
  x: 100 + i * 80,
  y: -20 - i * 30
}));
```

This creates 5 position objects in one expression. Compare to a `for` loop that pushes into an array — same result, less scaffolding.

## forEach

`forEach` calls a function on each element without creating a new array. It's a `for` loop without the index:

```js
stars.forEach((star) => {
  ctx.fillRect(star.x, star.y, 2, 2);
});
```

Use `forEach` when you want to do something with each element (draw it, log it) but don't need a new array back.

## Try it

Refactor `drawStars()` to use `forEach`. Then try converting one of the simpler update loops (like the power-up loop) to use `filter` for removal and `forEach` for drawing. You don't need to convert everything at once — use whichever style is clearer for each case.
