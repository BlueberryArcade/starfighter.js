# Boss Polish

The boss works mechanically, but it doesn't *feel* like a boss fight yet. Let's add visual feedback.

## Health bar

Add this to Boss's `draw()` method, after the main body and before `ctx.restore()`:

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

The bar is drawn in the boss's local coordinate space, so it moves with the boss.

## Hit flash

Add a property in the Boss constructor:

```js
    this.flashTimer = 0;
```

Update `hit()`:

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

In `update()`, tick it down at the top:

```js
    if (this.flashTimer > 0) { this.flashTimer = this.flashTimer - 1; }
```

In `draw()`, replace the body fill style:

```js
    if (this.flashTimer > 0) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = this.phase === 'enraged' ? '#ff2222' : '#aa44ff';
    }
```

## Explosion on death

When the boss dies, spawn a burst of fragments. In `main.js`, import Fragment if you haven't:

```js
import Fragment from './Fragment.js';
```

In `checkCollisions()`, when an enemy is destroyed:

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

## Guaranteed power-up drop

Right after the explosion code, before `enemies.splice`:

```js
          if (enemies[ei].points >= 10) {
            // ... explosion code ...
            powerups.push(new PowerUp(enemies[ei].x, 'detonator'));
          }
```

Save and play. The boss now has a health bar that shifts from green to red, flashes white on hit, explodes into fragments on death, and drops a detonator. That's a boss fight.
