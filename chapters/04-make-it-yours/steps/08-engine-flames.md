# Engine Flames

A ship should look like it's moving. Let's add a flickering engine flame behind the ship — a small animated shape that changes size each frame.

## The idea

The flame is just a triangle drawn **before** the main ship body (so it appears behind it). Its height varies randomly each frame, which creates a flickering effect. Because the ship is already translated and scaled, the flame uses the same coordinate system.

## Add the flame to Ship's draw()

In `Ship.js`, inside `draw()`, add this **before** the main ship's `ctx.beginPath()`:

```js
  // Engine flame — drawn first so it appears behind the ship body.
  const flicker = 1 + Math.random() * 2;
  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.moveTo(-1.0, 2.0);
  ctx.lineTo(1.0, 2.0);
  ctx.lineTo(0.0, 2.0 + flicker);
  ctx.closePath();
  ctx.fill();

  // Inner flame (brighter, shorter)
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.moveTo(-0.5, 2.0);
  ctx.lineTo(0.5, 2.0);
  ctx.lineTo(0.0, 2.0 + flicker * 0.5);
  ctx.closePath();
  ctx.fill();
```

The `y` values depend on where the bottom of your ship is. If your ship's lowest point is at `y = 2.0`, the flame starts there. If it's at `y = 3.0`, adjust accordingly. The flame should attach to the bottom of the hull.

`Math.random()` produces a new value every frame (since `draw()` is called 60 times per second), so the flame jitters naturally.

## Dual flames

If your ship has two engines (like the bottom of a Y-shape), draw two smaller flames:

```js
  const flicker = 1 + Math.random() * 1.5;
  ctx.fillStyle = '#ff8800';

  // Left engine
  ctx.beginPath();
  ctx.moveTo(-3.5, 2.5);
  ctx.lineTo(-2.5, 2.5);
  ctx.lineTo(-3.0, 2.5 + flicker);
  ctx.closePath();
  ctx.fill();

  // Right engine
  ctx.beginPath();
  ctx.moveTo(2.5, 2.5);
  ctx.lineTo(3.5, 2.5);
  ctx.lineTo(3.0, 2.5 + flicker);
  ctx.closePath();
  ctx.fill();
```

Adjust the x positions to match where the engines sit on your ship design.

## Try it

- Change `#ff8800` to `#00ccff` for a blue-white thruster.
- Increase the random range (`Math.random() * 4`) for wilder flicker.
- Add a third, even smaller inner flame for extra detail.
