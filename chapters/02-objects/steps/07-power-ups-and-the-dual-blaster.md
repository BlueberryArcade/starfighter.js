# Power-Ups and the Dual Blaster

The game has three enemy types now. Let's give the player something new too — a collectible power-up that upgrades their weapon.

## The plan

A power-up will float down from the top of the screen and settle at the same height as the player's ship. The player flies into it to pick it up. When collected, the ship's weapon changes from the single blaster to a **dual blaster** that fires two shots from either side of the ship.

## Create `power-up.js`

Create a new file `src/PowerUp.js`:

```js
import { ctx } from './game.js';

export default class PowerUp {
  constructor(x, targetY, type) {
    this.x = x;
    this.y = -20;
    this.targetY = targetY;
    this.type = type;
    this.speed = 1.5;
    this.settled = false;
  }

  update() {
    if (!this.settled) {
      this.y = this.y + this.speed;

      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.settled = true;
      }
    }
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
}
```

The constructor takes a `targetY` parameter — the y-position where the power-up should stop falling. We'll pass in the ship's y-position when we create it. This way the PowerUp class doesn't need to know anything about the ship — it just knows where to stop.

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
    powerups.push(new PowerUp(x, ship.y, 'dualBlaster'));
  }
```

## Update and draw power-ups

In `loop()`, add this block after `updateEnemies()` and before `drawHUD()`:

```js
  // --- Power-ups ---
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].update();
    powerups[i].draw();

    // Check if the ship touches this power-up.
    const dx = ship.x - powerups[i].x;
    const dy = ship.y - powerups[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 25) {
      ship.weapon = powerups[i].type;
      ship.weaponTimer = 600;
      powerups.splice(i, 1);
    }
  }
```

When the ship gets close enough, we set `ship.weapon` to the power-up's type and start a timer. The power-up is removed from the array.

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

The dual blaster creates two Blaster instances offset to the left and right of the ship. The default weapon fires a single one from the center. Notice that `Ship.js` now imports `blaster.js` — files can import from each other as needed.

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

Save all files and play. After about 15 seconds, a green diamond will float down and park at your altitude. Fly into it and your single blaster becomes a dual blaster for 10 seconds (600 frames). You'll see two shots fire from the sides of your ship.

In the next step, we'll add a more exotic weapon type.
