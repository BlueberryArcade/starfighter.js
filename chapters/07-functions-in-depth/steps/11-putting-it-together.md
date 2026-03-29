# Putting It Together

You now have a full toolkit: higher-order functions, closures, recursion, destructuring, and the array methods `map`, `filter`, `forEach`, and `reduce`. Let's see how they work together in a single refactoring pass.

## Before: updateEnemies

The current version:

```js
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();

    if (enemies[i].isOffScreen()) {
      enemies.splice(i, 1);
      lives--;
      if (lives <= 0) { gameOver = true; }
      continue;
    }

    enemies[i].draw();
  }
}
```

Backward loop, splice, continue. It works, but the intent is buried in mechanics.

## After: updateEnemies

```js
function updateEnemies() {
  enemies.forEach((e) => e.update());

  // Remove off-screen enemies and penalize the player.
  const escaped = enemies.filter((e) => e.isOffScreen());
  lives = lives - escaped.length;
  if (lives <= 0) { gameOver = true; }

  enemies = enemies.filter((e) => !e.isOffScreen());
  enemies.forEach((e) => e.draw());
}
```

Three things changed:

1. **Update all, then filter.** Instead of interleaving update/check/draw in one loop, each pass does one thing.
2. **`escaped` counts penalties.** `filter` collects the off-screen enemies, and `.length` gives the count. No manual counter.
3. **`enemies = enemies.filter(...)` replaces splice.** The array is replaced with a new one that excludes dead enemies.

Remember: for this to work, `enemies` must be `let` instead of `const`.

## A word on mutation

The splice approach *mutates* the array — it changes it in place. The filter approach creates a *new* array and discards the old one. Both are valid. The splice version avoids creating garbage (important in performance-critical code). The filter version is easier to read and harder to get wrong (no backward loop, no index math).

In this game, either approach is fast enough. In a game with 10,000 entities, you'd benchmark both and pick the faster one. For now, clarity wins.

## When *not* to convert

Some loops are better left as `for` loops:

- **`checkCollisions()`** — the nested loop with splice on both arrays is tricky to express with filter because removing from two arrays simultaneously depends on the index relationship. Forcing it into functional style would be less clear, not more.
- **The exploded-detonator check in `updateProjectiles()`** — it collects new projectiles while removing old ones, which is a reduce-like operation but harder to read as one.

The goal isn't to eliminate all `for` loops. It's to use the right tool for each situation. `forEach` when you're doing something to each element. `filter` when you're selecting elements. `map` when you're transforming. `reduce` when you're combining. `for` when the logic involves complex mutation or early exits.

## What you learned

This chapter covered a lot of ground:

- **Functions are values** — they can be stored, passed, and returned, just like numbers and strings.
- **Template literals** — backtick strings with `${}` for embedding expressions.
- **Closures** — a function remembers the variables around it, even after the surrounding code has finished.
- **Comparisons and truthiness** — `===` vs `==`, falsy values, short-circuit evaluation.
- **Recursion** — a function that calls itself, with a base case to stop.
- **map, filter, reduce** — array methods that express common patterns (transform, select, combine) without manual loops.
- **Destructuring** — pulling values out of objects and arrays into variables in one expression.

These aren't game-specific ideas. They're fundamental to JavaScript and to programming in general. Every library you'll ever use, every codebase you'll ever read, relies on some combination of these patterns. The networking chapters ahead use all of them — template literals for building messages, destructuring for parsing them, closures for managing connections, and array methods for processing data. Now you know what they mean when you see them.
