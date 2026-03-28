# Custom Projectiles

The ship and enemies look different now, but the projectiles are still rectangles and circles from Chapter 2. Let's give them some personality.

## Blaster.js

Open `Blaster.js`. The current `draw()` is:

```js
draw() {
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(this.x - 2, this.y - 8, 4, 16);
}
```

A 4×16 yellow rectangle. Try replacing it with a diamond shape:

```js
draw() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(-2, 0);
  ctx.lineTo(0, 4);
  ctx.lineTo(2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```

Or a small arrow shape, or a circle — whatever fits your game's aesthetic. These coordinates are in pixels (blaster has no scale factor) because projectiles are small and don't need a custom coordinate system.

## SprayParticle.js

The spray particles are tiny rectangles. Even a small change — like drawing a 3-pixel circle instead — adds visual variety:

```js
draw() {
  ctx.fillStyle = '#ff66ff';
  ctx.beginPath();
  ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
  ctx.fill();
}
```

## Fragment.js

Fragments from the detonator are 4×4 squares. Try giving them a random rotation for a more chaotic explosion. Add a `rotation` property in the constructor:

```js
constructor(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.life = 40;
  this.rotation = Math.random() * Math.PI * 2;
}
```

Then update `draw()`:

```js
draw() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();
  this.rotation = this.rotation + 0.1;
}
```

The fragments now spin as they fly — a small detail that makes the explosion feel more dynamic.

## Detonator.js

The detonator is a blinking red circle. Try adding a pulsing ring around it:

```js
draw() {
  const blink = this.timer < 15 && Math.floor(this.timer / 3) % 2 === 0;
  const pulse = 6 + Math.sin(this.timer * 0.3) * 2;

  ctx.save();
  ctx.translate(this.x, this.y);

  // Outer ring
  ctx.strokeStyle = 'rgba(255, 50, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, pulse + 4, 0, Math.PI * 2);
  ctx.stroke();

  // Core
  ctx.fillStyle = blink ? '#ffffff' : '#ff3300';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
```

`Math.sin(this.timer * 0.3)` oscillates the ring size, creating a radar-pulse effect that telegraphs the coming explosion.

## Try it

- Give the blaster a trail: draw a second, fainter shape a few pixels behind.
- Make spray particles fade out by multiplying `ctx.globalAlpha` by `this.life / 40` (if you add a `life` counter like fragments have).
