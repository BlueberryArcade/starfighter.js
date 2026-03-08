# Enemy Ships

Enemies will spawn at random positions along the top of the canvas and fall toward the player.

The pattern is exactly what we used for lasers: an array of objects, updated and drawn in a loop each frame.

## The enemy array and frame counter

Add these two variables near the top of `main.js`, with the other variable declarations:

```js
// All active enemies are stored here, each with an x and y position.
const enemies = [];

// frameCount increases by 1 every frame. We'll use it to control
// how often new enemies spawn without needing a separate timer.
let frameCount = 0;
```

## The `updateEnemies()` function

Add this new function alongside your other functions (above `loop()`):

```js
// Spawns new enemies on a timer, moves all existing enemies downward,
// removes ones that have left the canvas, and draws them.
function updateEnemies() {

  // Increment the frame counter each time this runs.
  frameCount++;

  // The % operator gives the remainder after division.
  // frameCount % 90 === 0 is true once every 90 frames (~1.5 seconds).
  // This is how we spread spawns out over time without a timer.
  if (frameCount % 90 === 0) {
    enemies.push({
      // Random X position, kept 15px away from each edge.
      x: Math.random() * (canvas.width - 30) + 15,
      // Start just above the visible canvas so the enemy slides in.
      y: -20
    });
  }

  // Loop backwards (same reason as with lasers: safe removal while iterating).
  for (let i = enemies.length - 1; i >= 0; i--) {

    // Move this enemy downward each frame.
    enemies[i].y = enemies[i].y + 2;

    // If it's fallen off the bottom of the canvas, remove it.
    if (enemies[i].y > canvas.height + 20) {
      enemies.splice(i, 1);
      continue;
    }

    // Draw the enemy as a downward-pointing triangle —
    // the same shape as the player's ship but flipped and red.
    ctx.save();
    ctx.translate(enemies[i].x, enemies[i].y);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(0, 20);     // nose points downward toward the player
    ctx.lineTo(-15, -15);  // top-left corner
    ctx.lineTo(15, -15);   // top-right corner
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
```

## Call it from `loop()`

Add a call to `updateEnemies()` inside `loop()`, after `updateLasers()`:

```js
  // --- Enemies ---
  updateEnemies();
```

Save. Enemies will start appearing after ~1.5 seconds and fall toward the ship. You can shoot, but the lasers pass right through — collision detection comes in the next step.

## Tuning the feel

Two numbers control the pace of the game:

- **`frameCount % 90`** — lower the number to spawn enemies more often. `% 60` is every second, `% 30` is twice a second.
- **`enemies[i].y + 2`** — increase this to make enemies fall faster.

Try tweaking both and find a difficulty that feels right to you.

## Seeing a pattern

Notice that `updateEnemies()` follows almost the same structure as `updateLasers()`:

1. Loop backwards through the array
2. Update position
3. Check if out of bounds — remove and `continue` if so
4. Draw

This pattern will repeat every time you add a new type of moving object to the game. In the next tutorial series, when we introduce classes, you'll see how to make this pattern even more reusable.

In the next step, we'll make the lasers and enemies aware of each other.
