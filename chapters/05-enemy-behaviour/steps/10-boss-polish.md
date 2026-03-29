# Boss Polish

The boss works mechanically, but it doesn't *feel* like a boss fight yet. Let's add visual feedback that makes the encounter more dramatic.

## Health bar

The player should be able to see how much HP the boss has left. Add this to Boss's `draw()` method, after the main body drawing and before `ctx.restore()`:

```js
    // Health bar above the boss.
    const barWidth = 60;
    const barHeight = 5;
    const barX = -barWidth / 2;
    const barY = -42;
    const hpRatio = this.hp / 30;

    // Background (empty portion).
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Filled portion — green to red as health drops.
    if (hpRatio > 0.5) {
      ctx.fillStyle = '#44ff44';
    } else if (hpRatio > 0.25) {
      ctx.fillStyle = '#ffaa00';
    } else {
      ctx.fillStyle = '#ff3333';
    }
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
```

The bar draws in the boss's local coordinate space (inside `save()/restore()`), so it moves with the boss automatically. The colour changes from green to orange to red as HP drops.

## Hit flash

When the boss takes damage, briefly flash it white. Add a property in the constructor:

```js
    this.flashTimer = 0;
```

In `hit()`, set the flash:

```js
  hit() {
    this.hp = this.hp - 1;
    this.flashTimer = 4;

    if (this.hp <= 15 && this.phase === 'patrol') {
      this.phase = 'enraged';
      this.patrolSpeed = 4;
    }

    return this.hp <= 0;
  }
```

In `update()`, tick it down (add this at the top, before the phase checks):

```js
    if (this.flashTimer > 0) { this.flashTimer = this.flashTimer - 1; }
```

In `draw()`, change the fill style to flash white when hit. Replace the body fill line:

```js
    if (this.flashTimer > 0) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = this.phase === 'enraged' ? '#ff2222' : '#aa44ff';
    }
```

## Explosion on death

When the boss is destroyed, spawn a burst of fragments — reusing the same `Fragment` class from the detonator. In `main.js`, import Fragment if you haven't already:

```js
import Fragment from './Fragment.js';
```

In the collision check inside `checkCollisions()`, when an enemy is destroyed:

```js
        if (destroyed) {
          score = score + enemies[ei].points;

          // Explosion for high-value enemies.
          if (enemies[ei].points >= 10) {
            for (let f = 0; f < 50; f++) {
              const angle = (Math.PI * 2 / 50) * f;
              const speed = 4 + Math.random() * 3;
              const vx = Math.cos(angle) * speed;
              const vy = Math.sin(angle) * speed;
              projectiles.push(new Fragment(enemies[ei].x, enemies[ei].y, vx, vy));
            }
          }

          enemies.splice(ei, 1);
        }
```

Any enemy worth 10 or more points (currently just the boss at 50) explodes into 50 golden fragments. The fragments are added to the `projectiles` array, so they're drawn and cleaned up automatically — the same pattern as the detonator explosion.

## Guaranteed power-up drop

Add a power-up drop when the boss dies. Right after the explosion code, before `enemies.splice`:

```js
          if (enemies[ei].points >= 10) {
            // ... explosion code ...
            powerups.push(new PowerUp(enemies[ei].x, 'detonator'));
          }
```

Make sure `PowerUp` is imported (it should be from Chapter 2).

Save and play. The boss now has a health bar, flashes white on hit, turns red and speeds up at half health, explodes into fragments on death, and drops a detonator. That's a boss fight.
