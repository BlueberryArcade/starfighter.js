# Power-Ups and the Dual Blaster

The game has three enemy types now. Let's give the player something new too — a collectible power-up that upgrades their weapon.

## The plan

A power-up will fall from the top of the screen, just like an enemy. The player can collect it in two ways: fly into it, or shoot it. Either way, the ship's weapon changes from the single blaster to a **dual blaster** that fires two shots from either side of the ship.

## Create `PowerUp.js`

Create a new file `src/PowerUp.js`:

```js
import { ctx } from './game.js';

export default class PowerUp {
  constructor(x, type) {
    this.x = x;
    this.y = -20;
    this.type = type;
    this.speed = 1.5;
    this.radius = 15;
  }

  update() {
    this.y = this.y + this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // A diamond shape — distinct from any enemy.
    ctx.fillStyle = '#44ff44';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  isOffScreen() {
    return this.y > 620;
  }
}
```

The power-up has `update()`, `draw()`, and `isOffScreen()` — the same interface as enemies and projectiles. It falls at a steady pace and disappears if it reaches the bottom without being collected.

## Import it in `main.js`

Add to the imports at the top of `main.js`:

```js
import PowerUp from './PowerUp.js';
```

## Add the power-ups array

Near the top of `main.js`, alongside the other arrays, add:

```js
const powerups = [];
```

## Spawn power-ups

In `spawnEnemies()`, add a chance to spawn a power-up. Add this after the enemy spawning block:

```js
  // Spawn a power-up roughly every 15 seconds.
  if (frameCount % 900 === 0) {
    const x = Math.random() * (canvas.width - 60) + 30;
    powerups.push(new PowerUp(x, 'dualBlaster'));
  }
```

## Collect power-ups

A power-up can be collected two ways: the ship touches it, or a projectile hits it. Add this function alongside your other game functions in `main.js`:

```js
function collectPowerUp(type) {
  ship.weapon = type;
  ship.weaponTimer = 600;
}
```

Then in `loop()`, add this block after `updateEnemies()` and before `drawHUD()`:

```js
  // --- Power-ups ---
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].update();

    if (powerups[i].isOffScreen()) {
      powerups.splice(i, 1);
      continue;
    }

    // Check if the ship touches this power-up.
    const dx = ship.x - powerups[i].x;
    const dy = ship.y - powerups[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < powerups[i].radius + 15) {
      collectPowerUp(powerups[i].type);
      powerups.splice(i, 1);
      continue;
    }

    // Check if any projectile hits this power-up.
    let collected = false;
    for (let j = projectiles.length - 1; j >= 0; j--) {
      const px = projectiles[j].x - powerups[i].x;
      const py = projectiles[j].y - powerups[i].y;
      const pd = Math.sqrt(px * px + py * py);

      if (pd < powerups[i].radius) {
        collectPowerUp(powerups[i].type);
        projectiles.splice(j, 1);
        collected = true;
        break;
      }
    }

    if (collected) {
      powerups.splice(i, 1);
      continue;
    }

    powerups[i].draw();
  }
```

There are two collision checks per power-up:

1. **Ship collision** — the same distance check we use everywhere. The `+ 15` accounts for the ship's size.
2. **Projectile collision** — loops through the projectiles array. If any projectile is close enough, the power-up is collected and the projectile is consumed.

Either way, `collectPowerUp()` is called with the power-up's type. Extracting this into a function avoids duplicating the weapon-switching logic.

## Add weapon state to the Ship class

Open `src/Ship.js`. In the constructor, add these two lines:

```js
    this.weapon = 'blaster';
    this.weaponTimer = 0;
```

Then add a weapon timer check at the end of the `update()` method:

```js
    // Count down the weapon timer. Revert to default when it expires.
    if (this.weaponTimer > 0) {
      this.weaponTimer = this.weaponTimer - 1;
      if (this.weaponTimer <= 0) {
        this.weapon = 'blaster';
      }
    }
```

## Add a `fire()` method to the Ship class

Still in `src/Ship.js`, add an import for Blaster at the top:

```js
import Blaster from './Blaster.js';
```

Then add this method to the Ship class:

```js
  fire(projectiles) {
    if (this.weapon === 'dualBlaster') {
      projectiles.push(new Blaster(this.x - 12, this.y - 15));
      projectiles.push(new Blaster(this.x + 12, this.y - 15));
    } else {
      projectiles.push(new Blaster(this.x, this.y - 20));
    }
  }
```

The dual blaster creates two Blaster instances offset to the left and right of the ship. The default weapon fires a single one from the center. Notice that `Ship.js` now imports `Blaster.js` — files can import from each other as needed.

## Update the keydown listener

Back in `main.js`, find the spacebar firing code:

```js
  if (event.key === ' ') {
    projectiles.push(new Blaster(ship.x, ship.y - 20));
  }
```

Replace it with:

```js
  if (event.key === ' ') {
    ship.fire(projectiles);
  }
```

Now the ship decides what to fire based on its current weapon. The keydown listener just says "fire" — it doesn't need to know the details.

## Update the restart block

In the restart block, reset the weapon and clear the powerups array:

```js
    ship.weapon = 'blaster';
    ship.weaponTimer = 0;
    projectiles.length = 0;
    enemies.length = 0;
    powerups.length = 0;
```

## Display the active weapon

In `drawHUD()`, add a line to show the current weapon:

```js
  if (ship.weapon !== 'blaster') {
    ctx.fillStyle = '#44ff44';
    ctx.fillText('Weapon: ' + ship.weapon, 10, 80);
  }
```

Save all files and play. After about 15 seconds, a green diamond will fall from the sky. You can either fly into it or shoot it — either way, your single blaster becomes a dual blaster for 10 seconds (600 frames). You'll see two shots fire from the sides of your ship.

In the next step, we'll add a more exotic weapon type.
