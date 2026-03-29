# Tracking the Player

The wave enemy follows a predetermined path — it doesn't know where the player is. A **tracker enemy** is different: it adjusts its course each frame to move toward the ship.

But first, we need to solve a problem. How does the enemy know where the ship is?

## Sharing the ship globally

Right now the `ship` object is created in `main.js` and only `main.js` can see it. We could pass `ship.x` as an argument to `update()`, but then we'd need to change the method signature for one enemy type — and every other enemy would need to accept and ignore that argument. That's messy.

A cleaner approach: store a reference to the ship in `game.js`, the same file that already shares `canvas` and `ctx`. Since `game.js` is the shared state file, this is a natural fit.

Open `game.js` and add:

```js
export let ship = null;

export function setShip(s) {
  ship = s;
}
```

`ship` starts as `null` because the ship hasn't been created yet when `game.js` first loads. `setShip()` is a function that `main.js` will call once the ship exists. We need the setter because JavaScript modules have a rule: when you `export let` a variable, other files can read it but only the file that owns it can reassign it. The setter gives `main.js` a way to do that.

## Register the ship in main.js

In `main.js`, update the import from `game.js`:

```js
import { canvas, ctx, setShip } from './game.js';
```

Then change the ship creation line:

```js
const ship = new Ship();
setShip(ship);
```

From this point on, any file that imports `ship` from `game.js` gets a live reference to the same ship object. When the ship moves, `ship.x` and `ship.y` update everywhere automatically — it's the same object in memory.

## Create `TrackerEnemy.js`

```js
import { ctx, ship } from './game.js';
import BaseEnemy from './BaseEnemy.js';

export default class TrackerEnemy extends BaseEnemy {
  constructor(x, y) {
    super(x, y, { speed: 2, radius: 18, hp: 2, points: 4 });
    this.trackSpeed = 1.5;
  }

  update() {
    super.update();

    if (ship) {
      if (this.x < ship.x) { this.x = this.x + this.trackSpeed; }
      if (this.x > ship.x) { this.x = this.x - this.trackSpeed; }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#ff4488';
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(-12, -10);
    ctx.lineTo(12, -10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
```

The `if (ship)` guard prevents a crash if the enemy somehow updates before the ship exists. Inside, the logic is simple: if the enemy is left of the ship, nudge right. If it's right, nudge left. `this.trackSpeed` controls how aggressively it follows — `1.5` is a lazy drift, `4` is an aggressive lock-on.

## Wire it in

In `main.js`:

```js
import TrackerEnemy from './TrackerEnemy.js';
```

Add to the spawn logic:

```js
    } else if (roll < 0.50) {
      enemies.push(new TrackerEnemy(x, -20));
    } else {
```

Save and play. Pink triangles drift toward your ship as they descend. They're harder to dodge than straight-line enemies because they follow you. But they're not fast enough to be unfair — `trackSpeed = 1.5` versus the ship's `speed = 5` means you can always outrun them.

## Why the global reference works

The ship reference in `game.js` is set once and read many times. It's not a copy of the position — it's a reference to the actual ship object. When `main.js` calls `ship.update(keys)` and the ship's x position changes, `TrackerEnemy` sees the updated value immediately because they're looking at the same object.

This pattern — a shared reference stored in a common module — is useful any time multiple parts of your code need to read the same data. We'll use `ship` again in the next step when enemies start shooting back.
