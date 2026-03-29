# Rotation

You've used `translate` and `scale` to position and size shapes. There's a third transform: **`ctx.rotate(angle)`**. It rotates everything drawn after it by the given angle, in radians.

## Radians

Angles in JavaScript aren't measured in degrees — they're measured in **radians**. A full circle is `Math.PI * 2` radians (roughly 6.28). A half turn is `Math.PI`. A quarter turn is `Math.PI / 2`.

You don't need to memorize the conversion. If you ever have degrees and need radians:

```js
const radians = degrees * Math.PI / 180;
```

But in practice, you'll work directly in radians because `Math.sin`, `Math.cos`, and `Math.atan2` all use them.

## Enemies that face their direction

Right now every enemy is drawn in the same orientation regardless of how it's moving. A `PatrolEnemy` swooping left draws the same as one swooping right. Let's make it face its direction of travel.

Open `PatrolEnemy.js`. Add a property in the constructor:

```js
    this.angle = 0;
```

In `update()`, when moving toward a waypoint, calculate the angle:

```js
      if (distance < 5) {
        this.waypointIndex = this.waypointIndex + 1;
      } else {
        this.x = this.x + (dx / distance) * this.speed;
        this.y = this.y + (dy / distance) * this.speed;
        this.angle = Math.atan2(dy, dx) + Math.PI / 2;
      }
```

`Math.atan2(dy, dx)` takes a difference in y and a difference in x and returns the angle (in radians) from the current position to the target. It handles all four quadrants correctly — unlike `Math.atan`, which only covers half the circle. The `+ Math.PI / 2` offset rotates the result by 90 degrees because our triangle points upward by default, but `atan2` returns 0 for pointing right.

In `draw()`, add the rotation after `translate`:

```js
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = '#55aaff';
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(-10, -8);
    ctx.lineTo(10, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
```

Save and play. Patrol enemies now point in the direction they're traveling. When they curve from one waypoint to the next, they visually rotate to follow the path.

## A spinning boss turret

Open `Boss.js`. The boss fires downward — but it's more dramatic if you can see a turret that aims at the player.

In the Boss constructor, add:

```js
    this.turretAngle = Math.PI / 2; // starts pointing down
```

In `update()`, after the phase movement and before the bullet update, calculate the turret angle:

```js
    if (ship) {
      const dx = ship.x - this.x;
      const dy = ship.y - this.y;
      this.turretAngle = Math.atan2(dy, dx);
    }
```

In `draw()`, after the main hexagon and before the health bar, draw the turret:

```js
    // Turret
    ctx.save();
    ctx.rotate(this.turretAngle + Math.PI / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-3, 0, 6, 20);
    ctx.restore();
```

This draws a small rectangle that rotates to point at the ship. The `ctx.save()`/`ctx.restore()` inside the existing save/restore is fine — saves nest like parentheses.

## Try it

- Add `this.angle += 0.03` in `WaveEnemy`'s `update()` and apply `ctx.rotate(this.angle)` in its `draw()` — the wave enemies spin as they oscillate.
- Give the `TrackerEnemy` a rotation that faces the player using the same `atan2` pattern.
- Try rotating fragments: add `this.rotation += 0.1` in Fragment's `update()` for spinning debris.
