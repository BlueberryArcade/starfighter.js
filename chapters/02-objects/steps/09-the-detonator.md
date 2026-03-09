# Power-up: The Detonator

The final weapon is the most interesting one. The **detonator** fires a single slow-moving projectile that explodes after a short time, sending fragments flying in all directions. Those fragments are projectiles too — they can hit enemies and are drawn and updated by the same loop as everything else.

This means one object needs to *create other objects* during the game. That's a new idea, and it requires a small change to how we handle projectiles.

## Create `Fragment.js`

Let's start with the pieces that the explosion creates. Create a new file `src/Fragment.js`:

```js
import { canvas, ctx } from './game.js';

export default class Fragment {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 40;
  }

  update() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    this.life = this.life - 1;
  }

  draw() {
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
  }

  isOffScreen() {
    return this.life <= 0 || this.x < 0 || this.x > canvas.width
      || this.y < 0 || this.y > canvas.height;
  }
}
```

Fragments use `vx` and `vy` like spray particles, but they also have a **`life`** counter that ticks down each frame. When life reaches 0, `isOffScreen()` returns true and the fragment is removed. This prevents fragments from flying around forever.

## Create `Detonator.js`

Create a new file `src/Detonator.js`:

```js
import { ctx } from './game.js';
import Fragment from './Fragment.js';


export default class Detonator {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.timer = 45;
    this.exploded = false;
  }

  update() {
    this.y = this.y - this.speed;
    this.timer = this.timer - 1;

    if (this.timer <= 0) {
      this.exploded = true;
    }
  }

  draw() {
    // Blink faster as the timer gets low.
    const blink = this.timer < 15 && Math.floor(this.timer / 3) % 2 === 0;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = blink ? '#ffffff' : '#ff3300';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isOffScreen() {
    return this.y < 0;
  }

  explode() {
    const fragments = [];
    const count = 100;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = 8 + Math.random() * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      fragments.push(new Fragment(this.x, this.y, vx, vy));
    }

    return fragments;
  }
}
```

A few things to notice:

- **`this.timer`** counts down each frame. When it hits 0, `this.exploded` is set to true.
- **`draw()`** makes the detonator blink when it's about to explode. `Math.floor(this.timer / 3) % 2` alternates between 0 and 1 every 3 frames.
- **`explode()`** creates 10 fragments arranged in a circle. `Math.cos(angle)` and `Math.sin(angle)` convert an angle into x and y components — this is how you turn a direction into a velocity. You don't need to understand the trigonometry deeply right now; the key idea is that each fragment gets a different `vx` and `vy` that sends it in a different direction.
- **`Detonator.js` imports `Fragment.js`** — this is the first time one of our class files imports another class file (not just `game.js`). That's completely normal. Files import whatever they need.

## Update the projectile loop

Here's the new challenge: when a detonator explodes, it needs to add fragments to the `projectiles` array. But we're already looping through that array. Adding items while looping can cause problems.

The solution is straightforward: collect any new projectiles in a separate array, and add them all after the loop is done.

In `main.js`, replace `updateProjectiles()` with this version:

```js
function updateProjectiles() {
  const newProjectiles = [];

  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();

    // If this projectile has exploded, collect its fragments.
    if (projectiles[i].exploded) {
      const fragments = projectiles[i].explode();
      for (let j = 0; j < fragments.length; j++) {
        newProjectiles.push(fragments[j]);
      }
      projectiles.splice(i, 1);
      continue;
    }

    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
      continue;
    }

    projectiles[i].draw();
  }

  // Add any newly spawned projectiles after the loop is done.
  for (let i = 0; i < newProjectiles.length; i++) {
    projectiles.push(newProjectiles[i]);
  }
}
```

The `exploded` check is the new part. When a detonator's timer runs out, we call `explode()` to get the fragments, collect them in `newProjectiles`, and remove the detonator from the array. After the main loop finishes, the fragments are added. On the next frame, they'll be updated and drawn like any other projectile.

Blasters and spray particles don't have an `exploded` property, so the check is harmlessly `undefined` (which is falsy) for them. Only detonators trigger it.

## Add the detonator to `fire()`

Open `src/Ship.js` and add an import at the top:

```js
import Detonator from './Detonator.js';
```

Then update `fire()` — add this block before the `else`:

```js
    } else if (this.weapon === 'detonator') {
      projectiles.push(new Detonator(this.x, this.y - 20));
```

Your complete `fire()` method should now be:

```js
  fire(projectiles) {
    if (this.weapon === 'dualBlaster') {
      projectiles.push(new Blaster(this.x - 12, this.y - 15));
      projectiles.push(new Blaster(this.x + 12, this.y - 15));
    } else if (this.weapon === 'wideSpray') {
      for (let i = 0; i < 15; i++) {
        projectiles.push(new SprayParticle(this.x, this.y - 20));
      }
    } else if (this.weapon === 'detonator') {
      projectiles.push(new Detonator(this.x, this.y - 20));
    } else {
      projectiles.push(new Blaster(this.x, this.y - 20));
    }
  }
```

## Add the detonator to the power-up pool

Back in `main.js`, update the power-up spawning in `spawnEnemies()`. Replace the type selection line:

```js
    const type = Math.random() < 0.9 ? 'dualBlaster' : 'wideSpray';
```

With:

```js
    const type = 'detonator'; // so we can focus on it
```


## Update the PowerUp's colour

Open `src/PowerUp.js` and add a colour for the detonator in the `draw()` method:

```js
    if (this.type === 'dualBlaster') {
      ctx.fillStyle = '#44ff44';
    } else if (this.type === 'wideSpray') {
      ctx.fillStyle = '#ff66ff';
    } else if (this.type === 'detonator') {
      ctx.fillStyle = '#ff3300';
    }
```

Save all files and play. When you pick up a red diamond and fire, a glowing red orb floats upward, blinking faster as it's about to explode. Then it bursts into 10 golden fragments that fly outward in a ring, destroying anything they touch.

## Objects creating objects

The detonator is the most complex thing in the game, but it follows the same rules as everything else. It has `update()`, `draw()`, and `isOffScreen()`. The one new idea is `explode()` — a method that *returns new objects*. The game loop collects those objects and adds them to the array. From that point on, the fragments are just more projectiles.

This is one of the most powerful patterns in object-oriented programming: objects that create other objects. A spaceship that launches drones. A tree that grows branches. A chat message that spawns reply threads. The same principle scales from games to every kind of software.

### Gameplay

To wrap things up, update the spawn probabilities. Here is a suggestion but set these to what you want. Remember that they have to be in ascending order because the if statement will short circuit to the first true statement.
```js
    const roll = Math.random();
    let type;
    if (roll < 0.8) {
      type = 'dualBlaster';
    } else if (roll < 0.9) {
      type = 'wideSpray';
    } else {
      type = 'detonator';
    }
```

## What you built

Take a step back and look at what this chapter accomplished:

- **Ship**, **Blaster**, **SprayParticle**, **Detonator**, **Fragment**, **Enemy**, **FastEnemy**, **TankEnemy**, **PowerUp** — nine classes, each in its own file, each responsible for its own data and behaviour.
- The game loop is short and readable. It doesn't know the details of any specific object — it just calls `update()`, `draw()`, and `isOffScreen()`.
- Adding a new enemy or weapon means writing a new file. Nothing else needs to change.
- Different objects in the same array can behave completely differently — that's **polymorphism**.
- Objects can create other objects — that's **composition**.
- Files import what they need from each other — that's **modules**.

In the last chapter, the code was organized around *actions* — functions that did things to data stored elsewhere. Now the code is organized around *things* — objects that carry their own data and know how to act on it. Both approaches work, but as programs grow, organizing around objects makes it far easier to add features, find bugs, and understand what's happening.

