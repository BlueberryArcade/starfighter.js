# Managing Enemy Bullets

Shooter enemies fire bullets, but those bullets pass right through the player. Let's add collision detection between enemy bullets and the ship.

## Check enemy bullets against the ship

In `main.js`, add a new function:

```js
function checkEnemyBullets() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (!enemies[i].bullets) continue;

    for (let j = enemies[i].bullets.length - 1; j >= 0; j--) {
      const b = enemies[i].bullets[j];
      const dx = b.x - ship.x;
      const dy = b.y - ship.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 18) {
        enemies[i].bullets.splice(j, 1);
        lives = lives - 1;
        if (lives <= 0) { gameOver = true; }
      }
    }
  }
}
```

The structure is the same as `checkCollisions()` — loop through bullets, measure distance to ship, remove on hit. The `if (!enemies[i].bullets) continue` check skips enemy types that don't have a bullets array (which is all of them except `ShooterEnemy`).

## Call it in the loop

In `loop()`, add the call after `checkCollisions()`:

```js
  checkCollisions();
  checkEnemyBullets();
```

Save and play. Now getting hit by a red bullet costs a life. The game just got harder.

## Visual feedback

It's hard to tell when you've been hit. Add a brief flash by tracking the hit in `main.js`:

```js
let hitFlash = 0;
```

In `checkEnemyBullets()`, when a bullet hits, set the flash timer:

```js
      if (distance < 18) {
        enemies[i].bullets.splice(j, 1);
        lives = lives - 1;
        hitFlash = 10;
        if (lives <= 0) { gameOver = true; }
      }
```

In `loop()`, after the background fill and before `drawStars()`:

```js
  if (hitFlash > 0) {
    ctx.fillStyle = 'rgba(255, 50, 50, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hitFlash = hitFlash - 1;
  }
```

A faint red overlay flashes for 10 frames (~160ms) when the player is hit. Subtle, but enough to register.

## Cleanup on restart

In the restart block inside the `keydown` listener, reset the flash:

```js
    hitFlash = 0;
```

## Balance

Shooter enemies make the game significantly harder. If it's too punishing, you have several knobs:

- **Fire rate** — increase the timer range in `ShooterEnemy.js` (e.g. `120 + Math.random() * 120` for slower fire)
- **Bullet speed** — decrease `this.speed` in `EnemyBullet.js`
- **Spawn rate** — reduce the probability in `spawnEnemies()`
- **Starting lives** — increase from 9 to 12

Adjust until it feels challenging but fair.
