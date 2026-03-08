# Power-up: Wide Spray

Time for a second weapon — and this time, you'll write more of it yourself.

The **wide spray** fires a burst of small particles that fan out in random directions. Unlike the blaster, which travels straight up, spray particles each have their own velocity — a speed in the x direction and a speed in the y direction. This is what makes them scatter.

## Velocity

Until now, every projectile has moved in one direction at a fixed speed. The blaster goes straight up: each frame, `y` decreases by `speed`. But what if a projectile needs to move diagonally, or at a random angle?

The solution is to store two velocity values:

- **`vx`** — how many pixels to move horizontally each frame (negative = left, positive = right)
- **`vy`** — how many pixels to move vertically each frame (negative = up, positive = down)

Each frame, the projectile adds `vx` to its `x` and `vy` to its `y`. By choosing different combinations, you can send a projectile in any direction.

## Create `SprayParticle.js`

Create a new file `src/SprayParticle.js`:

```js
import { canvas, ctx } from './game.js';

export default class SprayParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = -(Math.random() * 5 + 5);
  }

  update() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
  }

  draw() {
    ctx.fillStyle = '#ff66ff';
    ctx.fillRect(this.x - 1, this.y - 3, 3, 6);
  }

  isOffScreen() {
    return this.y < 0 || this.x < 0 || this.x > canvas.width;
  }
}
```

Let's break down the velocity lines:

- **`(Math.random() - 0.5) * 10`** gives a random number between -5 and 5. This is the horizontal spread — particles fly left, right, or straight, randomly.
- **`-(Math.random() * 5 + 5)`** gives a random number between -5 and -10. This is always negative (upward), so every particle flies toward the enemies, but at different speeds.

The `isOffScreen()` check now includes left and right edges too, since particles can travel sideways.

## Add it to the Ship's `fire()` method

Open `src/Ship.js` and add an import at the top:

```js
import SprayParticle from './SprayParticle.js';
```

Then update the `fire()` method. Add this block before the `else`:

```js
    } else if (this.weapon === 'wideSpray') {
      for (let i = 0; i < 15; i++) {
        projectiles.push(new SprayParticle(this.x, this.y - 20));
      }
```

Each press of the spacebar fires 15 particles at once. They all start from the same point but scatter because each one rolls its own random velocity.

Your full `fire()` method should now look like this:

```js
  fire(projectiles) {
    if (this.weapon === 'dualBlaster') {
      projectiles.push(new Blaster(this.x - 12, this.y - 15));
      projectiles.push(new Blaster(this.x + 12, this.y - 15));
    } else if (this.weapon === 'wideSpray') {
      for (let i = 0; i < 15; i++) {
        projectiles.push(new SprayParticle(this.x, this.y - 20));
      }
    } else {
      projectiles.push(new Blaster(this.x, this.y - 20));
    }
  }
```

## Spawn a wide spray power-up

Back in `main.js`, update the power-up spawning in `spawnEnemies()`. Replace the existing power-up spawn block:

```js
  if (frameCount % 900 === 0) {
    const x = Math.random() * (canvas.width - 60) + 30;
    powerups.push(new PowerUp(x, ship.y, 'dualBlaster'));
  }
```

With:

```js
  if (frameCount % 900 === 0) {
    const x = Math.random() * (canvas.width - 60) + 30;
    const type = Math.random() < 0.5 ? 'dualBlaster' : 'wideSpray';
    powerups.push(new PowerUp(x, ship.y, type));
  }
```

The `?` and `:` here is called a **ternary operator** — it's a compact way of writing an if/else that produces a value. `condition ? valueIfTrue : valueIfFalse`.

## Make the power-up colour match the weapon

Open `src/PowerUp.js` and update the `draw()` method. Replace the `ctx.fillStyle` line with:

```js
    // Green for dual blaster, pink for wide spray.
    if (this.type === 'dualBlaster') {
      ctx.fillStyle = '#44ff44';
    } else if (this.type === 'wideSpray') {
      ctx.fillStyle = '#ff66ff';
    }
```

Save all files and play. When you pick up a pink diamond, the spacebar unleashes a burst of magenta particles that scatter across the screen. It's chaotic, but effective — the spray can hit multiple enemies at once if they're clustered.

## Notice the pattern

We added a new weapon by creating one new file (`SprayParticle.js`), importing it in `Ship.js`, and adding a few lines to `fire()` and `spawnEnemies()`. The projectile loop, collision detection, and game loop didn't change at all. `SprayParticle` has `update()`, `draw()`, and `isOffScreen()` — the same methods as `Blaster` — so the existing code handles it automatically.

That's polymorphism at work again. Every new projectile type is just a new class that follows the same shape.

In the next step, we'll add one more weapon — and this one creates objects that create *other* objects.
