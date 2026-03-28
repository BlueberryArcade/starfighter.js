# Color and Outline

Your shapes are in. Collisions feel right. Now let's make things look better.

## Add outlines

A filled shape with no outline can look flat against the dark background. Adding a stroke pass after the fill gives it definition. In `Ship.js`, after `ctx.fill()` and before `ctx.restore()`:

```js
  ctx.strokeStyle = '#00b8d4';
  ctx.lineWidth = 0.15;
  ctx.stroke();
```

Because we're inside `ctx.scale(SHIP_SCALE, SHIP_SCALE)`, `lineWidth` is in ship-coordinate units. `0.15` will be about `0.75` pixels — thin enough to be subtle. Adjust to taste.

The stroke colour should be a slightly darker or lighter version of the fill. For the cyan ship: fill `#00e5ff`, stroke `#00b8d4`.

## Enemy colours

Do the same for each enemy type. Some suggestions:

- **Enemy** — fill `crimson`, stroke `darkred`
- **FastEnemy** — fill `darkorange`, stroke `#cc6600`
- **TankEnemy** — fill `mediumpurple`, stroke `#6a3d9a`

Remember, HTML colour names work directly: `ctx.fillStyle = 'crimson'`. You saw the full list in Chapter 3.

## A glow layer

For a quick glow effect, draw a larger, semi-transparent version of the shape **behind** the main one. In `Ship.js`, before the main `ctx.beginPath()`:

```js
  // Glow layer
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#00e5ff';
  ctx.scale(1.3, 1.3);
  ctx.beginPath();
  // ... same moveTo/lineTo as the main shape
  ctx.closePath();
  ctx.fill();

  // Reset for the main shape
  ctx.scale(1 / 1.3, 1 / 1.3);
  ctx.globalAlpha = 1.0;
```

This draws the same outline at 130% size with 15% opacity — a subtle halo around the ship. It's optional but adds polish.

## Try it

- Mix and match colours until the game has a consistent palette.
- Try a white outline on everything for a neon look.
- Try removing the fill entirely (`ctx.fill()`) and keeping only the stroke — a wireframe style.
