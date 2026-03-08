# Enemy Types

Right now every enemy is the same — same speed, same size, same colour, one hit to destroy. Let's add two new types. Each one gets its own file, its own class, and its own personality.

## FastEnemy

Create a new file `src/FastEnemy.js`:

```js
import { ctx } from './game.js';

export default class FastEnemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.radius = 12;
    this.hp = 1;
    this.points = 2;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(-8, -8);
    ctx.lineTo(8, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  isOffScreen() {
    return this.y > 620;
  }

  hit() {
    this.hp = this.hp - 1;
    return this.hp <= 0;
  }
}
```

Fast enemies are smaller, orange, move more than twice as fast, and are worth 2 points. Notice the `isOffScreen()` check uses `620` (the canvas height of 600 plus some margin) — a simple way to avoid importing `canvas` when the value won't change.

## TankEnemy

Create a new file `src/TankEnemy.js`:

```js
import { ctx } from './game.js';

export default class TankEnemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.radius = 28;
    this.hp = 3;
    this.points = 5;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#cc44cc';
    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo(-22, -20);
    ctx.lineTo(22, -20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  isOffScreen() {
    return this.y > 620;
  }

  hit() {
    this.hp = this.hp - 1;
    return this.hp <= 0;
  }
}
```

Tank enemies are large, purple, slow, take 3 hits to destroy, and are worth 5 points.

## Import them in `main.js`

Add these two lines to the imports at the top of `main.js`:

```js
import FastEnemy from './FastEnemy.js';
import TankEnemy from './TankEnemy.js';
```

## Randomize spawning

Update `spawnEnemies()` to randomly pick an enemy type:

```js
function spawnEnemies() {
  frameCount++;
  if (frameCount % 90 === 0) {
    const x = Math.random() * (canvas.width - 30) + 15;
    const roll = Math.random();

    if (roll < 0.2) {
      enemies.push(new FastEnemy(x, -20));
    } else if (roll < 0.35) {
      enemies.push(new TankEnemy(x, -20));
    } else {
      enemies.push(new Enemy(x, -20));
    }
  }
}
```

`Math.random()` returns a number between 0 and 1. A 20% chance produces a fast enemy, a 15% chance produces a tank, and the remaining 65% produces a regular enemy. Adjust these numbers to change the mix.

## That's it

Save and play. You'll see orange triangles zipping down, purple triangles lumbering through, and red triangles in between. Blasters destroy all of them — fast enemies pop in one hit, tanks take three. The score reflects the difficulty.

Here's the important part: **we didn't change `updateEnemies()`, `checkCollisions()`, or `loop()` at all.** Those functions call `update()`, `draw()`, `hit()`, and `isOffScreen()` — and every enemy type has those same methods. The game loop doesn't know or care which *type* of enemy it's dealing with. It just asks each one to do its thing.

## Polymorphism

This idea has a name: **polymorphism**. It means "many forms." The `enemies` array holds objects of different classes, but because they all respond to the same methods, the code that uses them doesn't need to treat them differently. One loop handles all of them.

Polymorphism is one of the most powerful ideas in programming. It means you can add a new enemy type — a `ShieldEnemy`, a `ZigZagEnemy`, anything — by writing one new class and one new file. The rest of the game just works.

In the next step, we'll use the same idea to add power-ups and a new weapon.
