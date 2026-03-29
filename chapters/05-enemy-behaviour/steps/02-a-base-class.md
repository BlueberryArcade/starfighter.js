# A Base Class

JavaScript has a keyword for sharing behaviour between classes: **`extends`**. When one class extends another, it inherits all of the parent's methods and properties. The child class only needs to define what's different.

## Create `BaseEnemy.js`

Create a new file `src/BaseEnemy.js`:

```js
import { canvas, ctx } from './game.js';

export default class BaseEnemy {
  constructor(x, y, { speed, radius, hp, points }) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.hp = hp;
    this.points = points;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    // Each enemy type overrides this.
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = 'white';
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();
  }

  isOffScreen() {
    return this.y > canvas.height + 30;
  }

  hit() {
    this.hp = this.hp - 1;
    return this.hp <= 0;
  }
}
```

`update()`, `isOffScreen()`, and `hit()` are the shared defaults. `draw()` has a placeholder — each type will override it. The constructor takes a configuration object for the stats so each subclass can pass its own values.

## Refactor Enemy.js

Open `Enemy.js` and replace the entire file:

```js
import { ctx } from './game.js';
import BaseEnemy from './BaseEnemy.js';

const ENEMY_SCALE = 5;

export default class Enemy extends BaseEnemy {
  constructor(x, y) {
    super(x, y, { speed: 2, radius: 20, hp: 1, points: 1 });
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(ENEMY_SCALE, ENEMY_SCALE);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    // Your enemy coordinates here
    ctx.moveTo(0, 2);
    ctx.lineTo(-1.5, -1.5);
    ctx.lineTo(1.5, -1.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
```

Two things to notice:

- **`extends BaseEnemy`** — tells JavaScript that `Enemy` inherits from `BaseEnemy`. Every method on `BaseEnemy` is available on `Enemy` unless `Enemy` defines its own version.
- **`super(x, y, { speed: 2, ... })`** — calls the parent's constructor. `super` means "the class I'm extending." The parent constructor sets up `this.x`, `this.y`, `this.speed`, and so on. The child just passes the values that make this type unique.

`Enemy` no longer has `update()`, `hit()`, or `isOffScreen()`. It inherits them from `BaseEnemy`. The only method it defines is `draw()` — the one thing that's actually different.

## Refactor FastEnemy.js and TankEnemy.js

The same pattern. Replace each file:

**FastEnemy.js:**
```js
import { ctx } from './game.js';
import BaseEnemy from './BaseEnemy.js';

export default class FastEnemy extends BaseEnemy {
  constructor(x, y) {
    super(x, y, { speed: 5, radius: 12, hp: 1, points: 2 });
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
}
```

**TankEnemy.js:**
```js
import { ctx } from './game.js';
import BaseEnemy from './BaseEnemy.js';

export default class TankEnemy extends BaseEnemy {
  constructor(x, y) {
    super(x, y, { speed: 1, radius: 28, hp: 3, points: 5 });
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
}
```

If you already customized `draw()` in Chapter 4, keep your version — just make sure the class `extends BaseEnemy` and the constructor calls `super()`.

Save all files and play. The game should work exactly as before. Three files got shorter, the duplicated code lives in one place, and adding new enemy types just got much easier.
