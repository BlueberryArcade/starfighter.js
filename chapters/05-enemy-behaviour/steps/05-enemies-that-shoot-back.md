# Enemies that Shoot Back

So far every enemy just falls. The player's only pressure is the volume of enemies and the loss of a life when one reaches the bottom. Let's change that: an enemy that fires downward at the player.

## Create `EnemyBullet.js`

First, the projectile itself. Create `src/EnemyBullet.js`:

```js
import { canvas, ctx } from './game.js';

export default class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 4;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.fillStyle = '#ff5555';
    ctx.fillRect(this.x - 2, this.y - 4, 4, 8);
  }

  isOffScreen() {
    return this.y > canvas.height;
  }
}
```

This looks almost identical to `Blaster.js` — except the bullet moves **down** (`+` instead of `-`) and is drawn in red. It follows the same `update()`/`draw()`/`isOffScreen()` interface as every other projectile.

## Create `ShooterEnemy.js`

```js
import { ctx } from './game.js';
import BaseEnemy from './BaseEnemy.js';
import EnemyBullet from './EnemyBullet.js';

export default class ShooterEnemy extends BaseEnemy {
  constructor(x, y) {
    super(x, y, { speed: 1.5, radius: 20, hp: 2, points: 4 });
    this.fireTimer = 60 + Math.floor(Math.random() * 60);
    this.bullets = [];
  }

  update() {
    super.update();

    this.fireTimer = this.fireTimer - 1;
    if (this.fireTimer <= 0) {
      this.bullets.push(new EnemyBullet(this.x, this.y + 15));
      this.fireTimer = 90 + Math.floor(Math.random() * 60);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      if (this.bullets[i].isOffScreen()) {
        this.bullets.splice(i, 1);
      }
    }
  }

  draw() {
    // Draw bullets first (behind the enemy)
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#dd2222';
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(-14, -12);
    ctx.lineTo(-6, -6);
    ctx.lineTo(6, -6);
    ctx.lineTo(14, -12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
```

Key details:

- **`this.fireTimer`** counts down each frame. When it reaches zero, a bullet is created and the timer resets to a random interval between 90 and 150 frames (1.5–2.5 seconds). The randomized starting timer prevents all shooter enemies from firing in sync.
- **`this.bullets`** is an array owned by the enemy. Each shooter manages its own projectiles. When the enemy is destroyed or goes off screen, the bullets go with it.

## Wire it in

In `main.js`:

```js
import ShooterEnemy from './ShooterEnemy.js';
```

Add to the spawn logic:

```js
    } else if (roll < 0.58) {
      enemies.push(new ShooterEnemy(x, -20));
    } else {
```

Save and play. Red enemies descend and periodically fire small red bullets downward. For now, the bullets just exist visually — they don't hurt the player yet. We'll wire up that collision in the next step.

## Why the enemy owns its bullets

You might wonder why each `ShooterEnemy` stores its own `bullets` array instead of pushing them into the shared `projectiles` array. The reason: enemy bullets and player projectiles behave differently. Player projectiles hit enemies. Enemy bullets should hit the **player**. Mixing them in one array would require every collision check to ask "is this bullet friendly or hostile?" — and we'd need to prevent enemy bullets from hitting other enemies.

Keeping them separate is simpler. In the next step we'll add the player-hit detection.
