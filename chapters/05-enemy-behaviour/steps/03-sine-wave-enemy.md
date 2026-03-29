# Sine Wave Enemy

Time to use the base class for something new. The **wave enemy** drifts down the screen while oscillating side to side in a smooth wave pattern.

## Create `WaveEnemy.js`

```js
import { ctx } from './game.js';
import BaseEnemy from './BaseEnemy.js';

export default class WaveEnemy extends BaseEnemy {
  constructor(x, y) {
    super(x, y, { speed: 1.5, radius: 16, hp: 1, points: 3 });
    this.age = 0;
    this.startX = x;
    this.amplitude = 80;
  }

  update() {
    super.update();
    this.age = this.age + 1;
    this.x = this.startX + Math.sin(this.age * 0.05) * this.amplitude;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#44ddaa';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
```

## What `super.update()` does

The `update()` method here **overrides** the parent's `update()`. But we still want the default behaviour — moving downward by `this.speed`. That's what `super.update()` does: it calls `BaseEnemy`'s version of `update()` first, then we add our own logic on top.

Without `super.update()`, the enemy would wave side to side but never move down. Without the override, it would move straight down without waving. `super` lets you say "do the default thing, *and* this extra thing."

## How the wave works

`Math.sin()` takes a number (an angle, in radians) and returns a value between `-1` and `1`. As `this.age` increases each frame, `Math.sin(this.age * 0.05)` produces a smooth oscillation. Multiplying by `this.amplitude` (80 pixels) turns that into visible horizontal movement.

- `0.05` controls the wave **speed** — smaller = slower oscillation, larger = faster.
- `this.amplitude` controls how far the enemy swings left and right.
- `this.startX` anchors the wave to the spawn position so the enemy doesn't drift off screen.

Try changing these values. `amplitude = 200` makes a dramatic swing. `0.02` makes a lazy drift. `0.15` makes it jittery.

## Wire it in

In `main.js`, import the new class:

```js
import WaveEnemy from './WaveEnemy.js';
```

Add it to the spawn logic in `spawnEnemies()`:

```js
    if (roll < 0.15) {
      enemies.push(new FastEnemy(x, -20));
    } else if (roll < 0.25) {
      enemies.push(new TankEnemy(x, -20));
    } else if (roll < 0.40) {
      enemies.push(new WaveEnemy(x, -20));
    } else {
      enemies.push(new Enemy(x, -20));
    }
```

Save and play. Green circles weave smoothly down the screen. They're harder to hit than straight-line enemies — the player has to lead their shots. The game loop didn't change. `BaseEnemy` handled the shared behaviour. The new class only defined what's different: the constructor stats, `update()`, and `draw()`.
