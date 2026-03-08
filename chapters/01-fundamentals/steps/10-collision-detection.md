# Collision Detection

Lasers pass through enemies. Let's fix that.

We need to check, every frame, whether any laser is close enough to any enemy to count as a hit. The technique is called **collision detection**, and for simple shapes like ours, we'll use distance: if the center of a laser is within a certain distance of the center of an enemy, that's a hit.

## Calculating distance

The distance between two points `(x1, y1)` and `(x2, y2)` comes from the Pythagorean theorem:

```
distance = Math.sqrt((x2 - x1)² + (y2 - y1)²)
```

JavaScript gives us `Math.sqrt()` for the square root and `**` for exponents (or you can just multiply: `dx * dx`). The full expression looks like:

```js
const dx = laser.x - enemy.x;
const dy = laser.y - enemy.y;
const distance = Math.sqrt(dx * dx + dy * dy);
```

If `distance` is less than some threshold, we have a hit.

## The `checkCollisions()` function

Add this function alongside the others, above `loop()`:

```js
// Checks every laser against every enemy.
// Removes both on a hit and increments the score.
function checkCollisions() {

  // We need two nested loops: one for lasers, one for enemies.
  // For each laser, we check it against every enemy.
  // Both loop backwards so splice() doesn't break our indices.
  for (let bi = lasers.length - 1; bi >= 0; bi--) {
    for (let ei = enemies.length - 1; ei >= 0; ei--) {

      // Calculate the distance between this laser and this enemy.
      const dx = lasers[bi].x - enemies[ei].x;
      const dy = lasers[bi].y - enemies[ei].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 20 pixels is roughly the radius of our triangle shape.
      // If closer than that, count it as a hit.
      if (distance < 20) {
        // Remove the enemy that was hit.
        enemies.splice(ei, 1);

        // Remove the laser that hit it.
        // After this, bi is no longer valid — so we break out of
        // the inner loop to stop checking this laser against more enemies.
        lasers.splice(bi, 1);
        break;
      }
    }
  }
}
```

## Call it from `loop()`

Add a call to `checkCollisions()` inside `loop()`, after `updateLasers()` and before `updateEnemies()`:

```js
  // --- Collisions ---
  checkCollisions();
```

Save and fire at the enemies. They disappear on impact.

## Nested loops

A **nested loop** is a loop inside another loop. For every iteration of the outer loop, the inner loop runs completely. With 5 lasers and 10 enemies, that's 50 checks per frame. This scales fine for small games like ours — for games with thousands of objects, more sophisticated techniques are used, but this is the right approach to start.

## Why `break`?

After `lasers.splice(bi, 1)`, that laser no longer exists in the array. If we let the inner loop continue, `lasers[bi]` would point to a different laser (or nothing), and we'd risk removing the wrong one. `break` exits the inner loop immediately, ensuring we stop checking a laser that's already been removed.

## Tuning the hit radius

The `20` in `distance < 20` is the hit radius. Our triangles are 15px wide and 35px tall, so 20 is a reasonable estimate. Try setting it to `5` for pixel-precise hits, or `35` for very forgiving hits, and see how the game feel changes.

In the final step, we'll track the score and add a game over state.
