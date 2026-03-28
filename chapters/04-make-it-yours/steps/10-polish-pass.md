# Polish Pass

The game is yours now — custom ship, custom enemies, tuned collisions, styled projectiles. This last step is open-ended. Here are directions to take it.

## Background depth

The star field is flat — 80 white dots all the same size. Give it depth by adding layers that scroll at different speeds. Replace the star setup at the top of `main.js`:

```js
const stars = [];
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.5 + 0.1
  });
}
```

Then update `drawStars()`:

```js
function drawStars() {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < stars.length; i++) {
    stars[i].y = stars[i].y + stars[i].speed;
    if (stars[i].y > canvas.height) {
      stars[i].y = 0;
      stars[i].x = Math.random() * canvas.width;
    }
    ctx.globalAlpha = stars[i].size / 2.5;
    ctx.fillRect(stars[i].x, stars[i].y, stars[i].size, stars[i].size);
  }
  ctx.globalAlpha = 1.0;
}
```

Larger stars move faster and are brighter. Smaller ones are dimmer and slower. The effect is a parallax star field — distant stars barely move, close ones drift past.

## Spawn rates and difficulty

In `spawnEnemies()`, the game spawns an enemy every 90 frames (~1.5 seconds). Try ramping up the difficulty over time:

```js
const spawnInterval = Math.max(30, 90 - Math.floor(frameCount / 300));
if (frameCount % spawnInterval === 0) {
```

This decreases the spawn interval as the game progresses, bottoming out at 30 frames (twice per second). The game gets harder the longer you survive.

## Power-up balance

Adjust the power-up probabilities in `spawnEnemies()`. Right now the detonator appears 10% of the time. If it's too powerful, make it 5%. If the game needs more variety, make power-ups spawn more often.

## Colour palette

Pick 3-4 colours and use them consistently:
- Ship and blaster in one hue
- Enemies in a contrasting hue
- Power-ups in a third colour
- Background and UI in neutral tones

A consistent palette makes the game feel designed rather than assembled.

## What you built

Take a step back. You started Chapter 1 with a blank canvas and `ctx.fillRect`. Now you have:

- A ship you designed
- Enemies you drew
- A module system keeping everything organized
- Polymorphism handling multiple types with one loop
- A drawing tool you built from scratch
- A debug mode you can toggle with a keypress
- Engine flames, styled projectiles, a parallax star field

This isn't a tutorial project anymore. It's a game. Rename the folder if you want — it's yours.

In the next chapter, we'll add new enemy behaviours: sine waves, player tracking, and enemies that shoot back.
