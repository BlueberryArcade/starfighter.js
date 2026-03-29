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
    this.bullets.push(new EnemyBullet(this.x - 20, this.y + 30));
    this.bullets.push(new EnemyBullet(this.x, this.y + 30));
    this.bullets.push(new EnemyBullet(this.x + 20, this.y + 30));
  }

  hit() {
    this.hp = this.hp - 1;

    if (this.hp <= 15 && this.phase === 'patrol') {
      this.phase = 'enraged';
      this.patrolSpeed = 4;
    }

    return this.hp <= 0;
  }

  draw() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }

    ctx.save();
    ctx.translate(this.x, this.y);

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

    ctx.strokeStyle = '#cc66ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  isOffScreen() {
    return false;
  }
}
```

## The three phases

The boss stores its current state in `this.phase`:

1. **`'enter'`** — slides down from off-screen. No shooting. Switches to patrol when it reaches position.
2. **`'patrol'`** — bounces side to side. Fires three bullets every second.
3. **`'enraged'`** — triggered at half HP. Speed doubles, fire rate doubles, colour changes to red.

Each `if` block in `update()` runs only when `this.phase` matches. The `phase` variable is checked, the relevant behaviour executes, and transitions happen when conditions are met (reaching `targetY`, or losing enough HP).

This pattern has a name: a **state machine**. An object's behaviour depends on which state it's in, and events trigger transitions between states. It's one of the most common patterns in game programming — menus, animations, AI, dialogue systems all use it.

## Wire it in

In `main.js`:

```js
import Boss from './Boss.js';
```

Add a boss spawn condition:

```js
let bossSpawned = false;
```

Inside `spawnEnemies()`, before the regular spawn logic:

```js
  if (score >= 50 && !bossSpawned) {
    enemies.push(new Boss());
    bossSpawned = true;
    return;
  }
```

Add `bossSpawned = false;` to the restart block.

Save and play. Score 50 points and a purple hexagon slides in from the top, patrols, fires triple shots, and turns red and aggressive at half health.

The `checkEnemyBullets()` function from Chapter 5 already handles the boss's bullets — they're in `this.bullets`, same structure as the `ShooterEnemy`.
