# The Boss

Every arcade game has a boss. A boss is a single enemy that's bigger, tougher, and more complex than anything else on screen. It appears at a milestone — we'll trigger ours after the player reaches a certain score.

## Create `Boss.js`

```js
import { canvas, ctx, ship } from './game.js';
import EnemyBullet from './EnemyBullet.js';
import BaseEnemy from './BaseEnemy.js';

export default class Boss extends BaseEnemy {
  constructor() {
    super(canvas.width / 2, -60, { speed: 1, radius: 40, hp: 30, points: 50 });
    this.phase = 'enter';
    this.fireTimer = 0;
    this.bullets = [];
    this.targetY = 80;
    this.direction = 1;
    this.patrolSpeed = 2;
  }

  update() {
    // --- Phase: enter ---
    if (this.phase === 'enter') {
      this.y = this.y + this.speed;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.phase = 'patrol';
      }
    }

    // --- Phase: patrol ---
    if (this.phase === 'patrol') {
      this.x = this.x + this.patrolSpeed * this.direction;

      if (this.x > canvas.width - 60) { this.direction = -1; }
      if (this.x < 60) { this.direction = 1; }

      // Fire a burst periodically.
      this.fireTimer = this.fireTimer - 1;
      if (this.fireTimer <= 0) {
        this.fireBurst();
        this.fireTimer = 60;
      }
    }

    // --- Phase: enraged ---
    if (this.phase === 'enraged') {
      this.x = this.x + this.patrolSpeed * this.direction;

      if (this.x > canvas.width - 60) { this.direction = -1; }
      if (this.x < 60) { this.direction = 1; }

      this.fireTimer = this.fireTimer - 1;
      if (this.fireTimer <= 0) {
        this.fireBurst();
        this.fireTimer = 30;
      }
    }

    // Update bullets.
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      if (this.bullets[i].isOffScreen()) {
        this.bullets.splice(i, 1);
      }
    }
  }

  fireBurst() {
    // Three bullets spread across the boss's width.
    this.bullets.push(new EnemyBullet(this.x - 20, this.y + 30));
    this.bullets.push(new EnemyBullet(this.x, this.y + 30));
    this.bullets.push(new EnemyBullet(this.x + 20, this.y + 30));
  }

  hit() {
    this.hp = this.hp - 1;

    // Switch to enraged phase at half health.
    if (this.hp <= 15 && this.phase === 'patrol') {
      this.phase = 'enraged';
      this.patrolSpeed = 4;
    }

    return this.hp <= 0;
  }

  draw() {
    // Draw bullets first (behind the boss).
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // Main body — a wide hexagon.
    ctx.fillStyle = this.phase === 'enraged' ? '#ff2222' : '#aa44ff';
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-35, -15);
    ctx.lineTo(-35, 15);
    ctx.lineTo(0, 30);
    ctx.lineTo(35, 15);
    ctx.lineTo(35, -15);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#cc66ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  isOffScreen() {
    // The boss never drifts off screen — it's either entering or patrolling.
    return false;
  }
}
```

## The three phases

The boss has three states stored in `this.phase`:

1. **`'enter'`** — slides down from off-screen to `targetY`. No shooting. Once it arrives, it switches to patrol.
2. **`'patrol'`** — moves back and forth across the screen. Fires a burst of three bullets every 60 frames (1 second).
3. **`'enraged'`** — triggered when HP drops to half. Speed doubles, fire rate doubles, colour changes to red.

Each `if` block in `update()` handles one phase. Only one phase is active at a time. The `phase` variable is checked at the top of each block, so the boss only runs the code that matches its current state.

This is a **state machine** — a pattern where an object's behaviour depends on which state it's in, and events (like losing health) trigger transitions between states. It's one of the most common patterns in game programming. Menus, animations, AI, dialogue systems — they all use state machines.

## Wire it in

In `main.js`:

```js
import Boss from './Boss.js';
```

Add a boss spawn condition. A simple approach — check score in `spawnEnemies()`:

```js
let bossSpawned = false;
```

Then inside `spawnEnemies()`, before the regular spawn logic:

```js
  if (score >= 50 && !bossSpawned) {
    enemies.push(new Boss());
    bossSpawned = true;
    return;
  }
```

Add `bossSpawned = false;` to the restart block.

Save and play. Rack up 50 points and a purple hexagon slides in from the top. It patrols, fires triple shots, and when you've chipped it to half health, it turns red and doubles its aggression.

The `checkEnemyBullets()` function from step 6 already handles the boss's bullets — they're in `this.bullets`, same as the `ShooterEnemy`.
